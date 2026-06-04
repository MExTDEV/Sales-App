"use client";

import { CalendarDays, ClipboardList, Home, MapPin, Route } from "lucide-react";
import { useMemo } from "react";
import type { Appointment, CountryCode, MockUser, TranslationFn } from "@/types/sales";

type GeoPoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  sequence?: number;
  type: "home" | "appointment";
};

type RouteLeg = {
  distanceKm: number;
  from: string;
  timeMin: number;
  to: string;
};

type MapView = {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
};

const appointmentDurations: Record<string, number> = {
  apt: 60,
  demo: 75,
  follow_up: 45
};

const homeLocations: Record<CountryCode, GeoPoint> = {
  BE: { id: "home-be", label: "Thuis", latitude: 51.2194, longitude: 4.4025, type: "home" },
  NL: { id: "home-nl", label: "Thuis", latitude: 52.3676, longitude: 4.9041, type: "home" },
  DE: { id: "home-de", label: "Thuis", latitude: 52.52, longitude: 13.405, type: "home" }
};

const coordinateFallbacks: Record<string, { latitude: number; longitude: number }> = {
  Antwerpen: { latitude: 51.2194, longitude: 4.4025 },
  Hasselt: { latitude: 50.9307, longitude: 5.3325 },
  Bornem: { latitude: 51.0972, longitude: 4.2436 },
  Gent: { latitude: 51.0543, longitude: 3.7174 },
  Amsterdam: { latitude: 52.3676, longitude: 4.9041 },
  Berlin: { latitude: 52.52, longitude: 13.405 },
  Leuven: { latitude: 50.8798, longitude: 4.7005 },
  Mechelen: { latitude: 51.0259, longitude: 4.4775 }
};

export function MyPreparationView({
  appointments,
  t,
  user,
  onOpenAppointment
}: {
  appointments: Appointment[];
  t: TranslationFn;
  user: MockUser;
  onOpenAppointment: (appointmentId: string) => void;
}) {
  const nextWorkday = useMemo(() => getNextWorkday(new Date()), []);
  const nextWorkdayKey = toIsoDate(nextWorkday);
  const exactNextWorkdayAppointments = appointments.filter((appointment) => appointment.date === nextWorkdayKey && appointment.assignedUserId === user.id);
  const fallbackAppointments = appointments.filter((appointment) => appointment.assignedUserId === user.id);
  const visibleAppointments = (exactNextWorkdayAppointments.length > 0 ? exactNextWorkdayAppointments : fallbackAppointments)
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));
  const displayDate = exactNextWorkdayAppointments.length > 0 ? nextWorkday : dateFromIso(visibleAppointments[0]?.date) ?? nextWorkday;
  const routeData = useMemo(() => buildRouteData(visibleAppointments, user.country), [user.country, visibleAppointments]);

  return (
    <section className="grid gap-3">
      <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-blue-50 px-4 py-3">
          <div className="grid size-11 place-items-center rounded-lg bg-blue-100 text-[#003B83]">
            <ClipboardList aria-hidden="true" size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#003B83]">{t("nav.myPreparation")}</p>
            <h2 className="truncate text-xl font-black text-slate-950">{t("myPreparation.title")}</h2>
            <p className="truncate text-xs font-semibold text-slate-500">Agenda voor {formatLongDate(displayDate)}</p>
          </div>
          <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 text-xs font-black text-[#003B83]">
            <CalendarDays aria-hidden="true" size={15} strokeWidth={2} />
            Volgende werkdag
          </span>
        </div>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="mb-3 text-center text-sm font-semibold text-[#003B83]">Klik op een afspraak om de voorbereiding te bekijken.</p>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <colgroup>
              <col className="w-[6.5rem]" />
              <col className="w-[6.5rem]" />
              <col className="w-[24%]" />
              <col className="w-[13rem]" />
              <col className="w-[5.5rem]" />
              <col className="w-[9.5rem]" />
            </colgroup>
            <thead className="bg-slate-50">
              <tr>
                {["Beginuur", "Einduur", "Naam", "Adres", "P/K", "Voorbereiding"].map((header, index) => (
                  <th key={header} className={`break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 ${index < 2 ? "px-2" : ""}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visibleAppointments.map((appointment) => {
                const relation = relationForAppointment(appointment);

                return (
                  <tr
                    key={appointment.id}
                    className="cursor-pointer transition hover:bg-blue-50/70"
                    onClick={() => onOpenAppointment(appointment.id)}
                  >
                    <td className="break-words px-2 py-3 font-black text-slate-950">{appointment.time}</td>
                    <td className="break-words px-2 py-3 font-semibold text-slate-700">{endTime(appointment)}</td>
                    <td className="break-words px-3 py-3 font-black text-slate-950">{relation.name}</td>
                    <td className="break-words px-3 py-2 text-xs font-semibold leading-4 text-slate-600">
                      <span className="block text-slate-800">{appointment.address.line1}</span>
                      <span className="block">{appointment.address.postalCode} {appointment.address.city}</span>
                    </td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{relation.type}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{hasPreparation(appointment) ? "Ja" : "Neen"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      <article className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">Route volgende werkdag</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Thuisadres start en eindpunt, afspraken genummerd volgens beginuur.</p>
          </div>
          <span className="inline-flex min-h-8 items-center gap-2 rounded-md bg-blue-50 px-3 text-xs font-black text-[#003B83]">
            <Route aria-hidden="true" size={15} strokeWidth={2} />
            {routeData.appointmentPoints.length} stops
          </span>
        </div>
        <PreparationRouteMap points={routeData.points} />
        <div className="grid gap-2 md:grid-cols-3">
          {routeData.legs.map((leg) => (
            <div key={`${leg.from}-${leg.to}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
              <span className="font-black text-slate-950">{leg.from} &rarr; {leg.to}</span>: {leg.distanceKm.toFixed(1)} km - {leg.timeMin} min
            </div>
          ))}
          {routeData.legs.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
              Geen geldige locaties gevonden voor de routekaart.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function PreparationRouteMap({ points }: { points: GeoPoint[] }) {
  const width = 1024;
  const height = 300;
  const view = fitView(points, width, height);
  const centerWorld = latLngToWorld(view.center.latitude, view.center.longitude, view.zoom);
  const centerTile = {
    x: Math.floor(centerWorld.x / 256),
    y: Math.floor(centerWorld.y / 256)
  };
  const tiles = createTiles(centerTile.x, centerTile.y, centerWorld, width, height, view.zoom);
  const path = points
    .map((point) => {
      const position = pointToViewport(point.latitude, point.longitude, centerWorld, width, height, view.zoom);
      return `${position.x},${position.y}`;
    })
    .join(" ");

  return (
    <div className="relative min-h-[19rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {tiles.map((tile) => (
        <img
          alt=""
          className="absolute size-64 select-none"
          draggable={false}
          key={`${tile.x}-${tile.y}`}
          src={`https://tile.openstreetmap.org/${view.zoom}/${tile.x}/${tile.y}.png`}
          style={{ left: tile.left, top: tile.top }}
        />
      ))}
      <svg className="pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        {path && <polyline fill="none" points={path} stroke="#003B83" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.82" strokeWidth="5" />}
      </svg>
      {points.map((point, index) => {
        const position = pointToViewport(point.latitude, point.longitude, centerWorld, width, height, view.zoom);
        const isHome = point.type === "home";
        const key = `${point.id}-${index}`;

        return isHome ? (
          <span
            className="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-slate-800 text-white shadow-lg"
            key={key}
            style={{ left: `${(position.x / width) * 100}%`, top: `${(position.y / height) * 100}%` }}
          >
            <Home aria-hidden="true" size={16} strokeWidth={2.4} />
          </span>
        ) : (
          <button
            className="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#003B83] text-sm font-black text-white shadow-lg"
            key={key}
            title={point.label}
            type="button"
            style={{ left: `${(position.x / width) * 100}%`, top: `${(position.y / height) * 100}%` }}
          >
            {point.sequence}
          </button>
        );
      })}
      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-xs font-black text-slate-700 shadow">
        <MapPin aria-hidden="true" size={15} strokeWidth={2} />
        Alle afspraken
      </div>
      <div className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-1 text-[0.65rem] font-semibold text-slate-600 shadow">&copy; OpenStreetMap contributors</div>
    </div>
  );
}

function buildRouteData(appointments: Appointment[], country: CountryCode) {
  const home = homeLocations[country] ?? homeLocations.BE;
  const appointmentPoints: GeoPoint[] = appointments.flatMap((appointment, index) => {
      const coordinates = coordinatesForAppointment(appointment);
      if (!coordinates) {
        return [];
      }

      return [{
        id: appointment.id,
        label: relationForAppointment(appointment).name,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        sequence: index + 1,
        type: "appointment" as const
      }];
    });
  const points: GeoPoint[] = appointmentPoints.length > 0 ? [home, ...appointmentPoints, { ...home, id: `${home.id}-end` }] : [];
  const legs: RouteLeg[] = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    const distanceKm = haversineKm(point, next);

    return {
      distanceKm,
      from: routeLabel(point),
      timeMin: Math.max(1, Math.round((distanceKm / 45) * 60)),
      to: routeLabel(next)
    };
  });

  return { appointmentPoints, legs, points };
}

function coordinatesForAppointment(appointment: Appointment) {
  const direct = appointment.address as Appointment["address"] & { latitude?: number; longitude?: number };

  if (typeof direct.latitude === "number" && typeof direct.longitude === "number") {
    return { latitude: direct.latitude, longitude: direct.longitude };
  }

  return coordinateFallbacks[appointment.address.city];
}

function relationForAppointment(appointment: Appointment) {
  if (appointment.customer) {
    return { name: appointment.customer.name, type: "Klant" };
  }

  if (appointment.prospect) {
    return { name: appointment.prospect.name, type: "Prospect" };
  }

  return { name: "Afspraak", type: "Onbekend" };
}

function hasPreparation(appointment: Appointment) {
  return appointment.notes.trim().length > 0 || appointment.history.length > 1 || appointment.service.contracts > 0 || appointment.service.workOrders > 0;
}

function endTime(appointment: Appointment) {
  const [hours, minutes] = appointment.time.split(":").map(Number);
  const duration = appointmentDurations[appointment.type] ?? 60;
  const start = new Date(2026, 0, 1, hours, minutes + duration);

  return start.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" });
}

function getNextWorkday(from: Date) {
  const next = new Date(from);
  next.setDate(next.getDate() + 1);

  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

function dateFromIso(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Date(`${value}T12:00:00`);
}

function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLongDate(value: Date) {
  return value.toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "long",
    weekday: "long",
    year: "numeric"
  });
}

function routeLabel(point: GeoPoint) {
  return point.type === "home" ? "Thuis" : `Afspraak ${point.sequence}`;
}

function haversineKm(first: GeoPoint, second: GeoPoint) {
  const radius = 6371;
  const dLat = degToRad(second.latitude - first.latitude);
  const dLng = degToRad(second.longitude - first.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degToRad(first.latitude)) * Math.cos(degToRad(second.latitude)) * Math.sin(dLng / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function fitView(points: GeoPoint[], width: number, height: number): MapView {
  const fallback = homeLocations.BE;

  if (points.length === 0) {
    return { center: fallback, zoom: 8 };
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const bounds = {
    center: {
      latitude: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
      longitude: (Math.max(...longitudes) + Math.min(...longitudes)) / 2
    },
    east: Math.max(...longitudes),
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    west: Math.min(...longitudes)
  };
  const minZoom = 7;
  const maxZoom = 15;
  const padding = 28;
  let zoom = maxZoom;

  for (let candidate = maxZoom; candidate >= minZoom; candidate--) {
    const northwest = latLngToWorld(bounds.north, bounds.west, candidate);
    const southeast = latLngToWorld(bounds.south, bounds.east, candidate);

    if (Math.abs(southeast.x - northwest.x) <= width - padding * 2 && Math.abs(southeast.y - northwest.y) <= height - padding * 2) {
      zoom = candidate;
      break;
    }
  }

  return { center: bounds.center, zoom };
}

function createTiles(centerTileX: number, centerTileY: number, centerWorld: { x: number; y: number }, width: number, height: number, zoom: number) {
  const tiles: Array<{ x: number; y: number; left: number; top: number }> = [];
  const maxTile = 2 ** zoom;

  for (let xOffset = -3; xOffset <= 3; xOffset++) {
    for (let yOffset = -2; yOffset <= 2; yOffset++) {
      const rawX = centerTileX + xOffset;
      const tileX = ((rawX % maxTile) + maxTile) % maxTile;
      const tileY = centerTileY + yOffset;

      if (tileY < 0 || tileY >= maxTile) {
        continue;
      }

      tiles.push({
        x: tileX,
        y: tileY,
        left: rawX * 256 - centerWorld.x + width / 2,
        top: tileY * 256 - centerWorld.y + height / 2
      });
    }
  }

  return tiles;
}

function pointToViewport(latitude: number, longitude: number, centerWorld: { x: number; y: number }, width: number, height: number, zoom: number) {
  const world = latLngToWorld(latitude, longitude, zoom);

  return {
    x: world.x - centerWorld.x + width / 2,
    y: world.y - centerWorld.y + height / 2
  };
}

function latLngToWorld(latitude: number, longitude: number, zoom: number) {
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);
  const scale = 256 * 2 ** zoom;

  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale
  };
}
