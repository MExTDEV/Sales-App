"use client";

import { LocateFixed, Maximize2, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type Dispatch, type MouseEvent, type ReactNode, type SetStateAction, type Touch, type TouchEvent, type WheelEvent } from "react";
import type { OptimizedRouteStop } from "@/lib/pstRouteOptimizationService";
import type { PstProspect, PstSegment, TranslationFn } from "@/types/sales";

export type PstMapStop = OptimizedRouteStop & {
  representativeName?: string;
  routeNumber?: string;
  segmentName?: string;
};

export type PstMapSegment = PstSegment & {
  addressLineCount?: number;
};

type MapView = {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
};

export function PstMap({
  centerOnSelect = false,
  className = "",
  emptyMessage,
  onSegmentOpen,
  onSegmentSelect,
  onShowAll,
  onSelect,
  selectedSegmentId,
  selectedStopId,
  segments = [],
  stops,
  t,
  title
}: {
  centerOnSelect?: boolean;
  className?: string;
  emptyMessage?: string;
  onSegmentOpen?: (id: string) => void;
  onSegmentSelect?: (id: string) => void;
  onShowAll?: () => void;
  selectedSegmentId?: string;
  onSelect?: (id: string) => void;
  segments?: PstMapSegment[];
  selectedStopId?: string;
  stops: PstMapStop[];
  t: TranslationFn;
  title?: string;
}) {
  const minZoom = 10;
  const maxZoom = 18;
  const width = 1024;
  const height = 448;
  const [internalSelectedStopId, setInternalSelectedStopId] = useState<string>();
  const activeSelectedStopId = selectedStopId ?? internalSelectedStopId ?? stops[0]?.id;
  const selectedStop = stops.find((stop) => stop.id === activeSelectedStopId);
  const [internalSelectedSegmentId, setInternalSelectedSegmentId] = useState<string>();
  const activeSelectedSegmentId = selectedSegmentId ?? internalSelectedSegmentId;
  const activeSelectedSegment = segments.find((segment) => segment.id === activeSelectedSegmentId);
  const [detailsStop, setDetailsStop] = useState<PstMapStop>();
  const [visitActionsStop, setVisitActionsStop] = useState<PstMapStop>();
  const [fullscreen, setFullscreen] = useState(false);
  const [view, setView] = useState<MapView>(() => fitViewForFeatures(stops, segments, width, height, minZoom, maxZoom));
  const stopSignature = stops.map((stop) => `${stop.id}:${stop.prospect.latitude}:${stop.prospect.longitude}`).join("|");
  const segmentSignature = segments.map((segment) => `${segment.id}:${segment.boundaryGeoJson?.coordinates.flat(2).join(",")}`).join("|");

  useEffect(() => {
    setView(fitViewForFeatures(stops, segments, width, height, minZoom, maxZoom));
  }, [segmentSignature, segments, stopSignature, stops]);

  useEffect(() => {
    if (!centerOnSelect || !selectedStop) {
      return;
    }

    setView((current) => ({
      center: {
        latitude: selectedStop.prospect.latitude,
        longitude: selectedStop.prospect.longitude
      },
      zoom: Math.max(current.zoom, 14)
    }));
  }, [centerOnSelect, activeSelectedStopId, selectedStop]);

  useEffect(() => {
    if (!centerOnSelect || !activeSelectedSegment) {
      return;
    }

    setView(fitViewForFeatures([], [activeSelectedSegment], width, height, minZoom, 14));
  }, [activeSelectedSegment, activeSelectedSegmentId, centerOnSelect]);

  useEffect(() => {
    if (!fullscreen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreen]);

  const handleSelect = (stop: PstMapStop) => {
    setInternalSelectedStopId(stop.id);
    onSelect?.(stop.id);
    setDetailsStop(stop);
  };
  const handleSegmentSelect = (segment: PstMapSegment) => {
    setInternalSelectedSegmentId(segment.id);
    onSegmentSelect?.(segment.id);
  };
  const resetRouteView = () => {
    onShowAll?.();
    setView(fitViewForFeatures(stops, segments, width, height, minZoom, maxZoom));
  };

  return (
    <>
      <PstMapCanvas
        className={className}
        height={height}
        emptyMessage={emptyMessage}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onFullscreen={() => setFullscreen(true)}
        onReset={resetRouteView}
        onSegmentOpen={onSegmentOpen}
        onSegmentSelect={handleSegmentSelect}
        onSelect={handleSelect}
        selectedSegment={activeSelectedSegment}
        selectedSegmentId={activeSelectedSegmentId}
        selectedStopId={activeSelectedStopId}
        segments={segments}
        setView={setView}
        stops={stops}
        t={t}
        title={title}
        view={view}
        width={width}
      />
      {fullscreen && (
        <PstMapFullscreen onClose={() => setFullscreen(false)}>
          <PstMapCanvas
            className="h-full min-h-0 rounded-none border-0"
            height={height}
            emptyMessage={emptyMessage}
            maxZoom={maxZoom}
            minZoom={minZoom}
            onClose={() => setFullscreen(false)}
            onFullscreen={() => setFullscreen(true)}
            onReset={resetRouteView}
            onSegmentOpen={onSegmentOpen}
            onSegmentSelect={handleSegmentSelect}
            onSelect={handleSelect}
            selectedSegment={activeSelectedSegment}
            selectedSegmentId={activeSelectedSegmentId}
            selectedStopId={activeSelectedStopId}
            segments={segments}
            setView={setView}
            stops={stops}
            t={t}
            title={title}
            view={view}
            width={width}
          />
        </PstMapFullscreen>
      )}
      {detailsStop && (
        <PstStopDetailsModal
          onClose={() => setDetailsStop(undefined)}
          onVisitActions={() => {
            setVisitActionsStop(detailsStop);
            setDetailsStop(undefined);
          }}
          stop={detailsStop}
          t={t}
        />
      )}
      {visitActionsStop && <PstVisitActionsModal onClose={() => setVisitActionsStop(undefined)} stop={visitActionsStop} />}
    </>
  );
}

function PstMapCanvas({
  className,
  emptyMessage,
  height,
  maxZoom,
  minZoom,
  onClose,
  onFullscreen,
  onReset,
  onSegmentOpen,
  onSegmentSelect,
  onSelect,
  selectedSegment,
  selectedSegmentId,
  selectedStopId,
  segments,
  setView,
  stops,
  t,
  title,
  view,
  width
}: {
  className: string;
  emptyMessage?: string;
  height: number;
  maxZoom: number;
  minZoom: number;
  onClose?: () => void;
  onFullscreen: () => void;
  onReset: () => void;
  onSegmentOpen?: (id: string) => void;
  onSegmentSelect: (segment: PstMapSegment) => void;
  onSelect: (stop: PstMapStop) => void;
  selectedSegment?: PstMapSegment;
  selectedSegmentId?: string;
  selectedStopId?: string;
  segments: PstMapSegment[];
  setView: Dispatch<SetStateAction<MapView>>;
  stops: PstMapStop[];
  t: TranslationFn;
  title?: string;
  view: MapView;
  width: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; centerWorld: { x: number; y: number } } | undefined>(undefined);
  const pinchRef = useRef<{ distance: number; zoom: number; centerWorld: { x: number; y: number }; midpoint: { x: number; y: number } } | undefined>(undefined);
  const centerWorld = latLngToWorld(view.center.latitude, view.center.longitude, view.zoom);
  const centerTile = {
    x: Math.floor(centerWorld.x / 256),
    y: Math.floor(centerWorld.y / 256)
  };
  const tiles = createTiles(centerTile.x, centerTile.y, centerWorld, width, height, view.zoom);
  const selectedStop = stops.find((stop) => stop.id === selectedStopId);
  const path = stops.map((stop) => {
    const position = pointToViewport(stop.prospect.latitude, stop.prospect.longitude, centerWorld, width, height, view.zoom);
    return `${position.x},${position.y}`;
  }).join(" ");
  const segmentPolygons = segments
    .map((segment) => ({
      center: getSegmentBounds(segment).center,
      points: polygonToViewportPoints(segment, centerWorld, width, height, view.zoom),
      segment
    }))
    .filter((item) => item.points.length > 0);

  const zoomAt = (clientX: number, clientY: number, nextZoom: number) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) {
      setView((current) => ({ ...current, zoom: clamp(nextZoom, minZoom, maxZoom) }));
      return;
    }

    setView((current) => {
      const clampedZoom = clamp(nextZoom, minZoom, maxZoom);
      const point = {
        x: ((clientX - rect.left) / rect.width) * width,
        y: ((clientY - rect.top) / rect.height) * height
      };
      const currentWorld = latLngToWorld(current.center.latitude, current.center.longitude, current.zoom);
      const targetWorld = {
        x: currentWorld.x + point.x - width / 2,
        y: currentWorld.y + point.y - height / 2
      };
      const targetLatLng = worldToLatLng(targetWorld.x, targetWorld.y, current.zoom);
      const targetAtNextZoom = latLngToWorld(targetLatLng.latitude, targetLatLng.longitude, clampedZoom);
      const nextCenter = worldToLatLng(targetAtNextZoom.x - point.x + width / 2, targetAtNextZoom.y - point.y + height / 2, clampedZoom);

      return { center: nextCenter, zoom: clampedZoom };
    });
  };

  const zoomBy = (step: number) => {
    const rect = mapRef.current?.getBoundingClientRect();
    zoomAt(rect ? rect.left + rect.width / 2 : 0, rect ? rect.top + rect.height / 2 : 0, view.zoom + step);
  };

  const panBy = (deltaX: number, deltaY: number, startCenterWorld?: { x: number; y: number }) => {
    setView((current) => {
      const world = startCenterWorld ?? latLngToWorld(current.center.latitude, current.center.longitude, current.zoom);
      return {
        center: worldToLatLng(world.x - deltaX, world.y - deltaY, current.zoom),
        zoom: current.zoom
      };
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, view.zoom + (event.deltaY < 0 ? 1 : -1));
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      centerWorld
    };
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    panBy(((event.clientX - dragRef.current.x) / rect.width) * width, ((event.clientY - dragRef.current.y) / rect.height) * height, dragRef.current.centerWorld);
  };

  const finishDrag = () => {
    dragRef.current = undefined;
    pinchRef.current = undefined;
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1) {
      dragRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        centerWorld
      };
      pinchRef.current = undefined;
      return;
    }

    if (event.touches.length === 2) {
      const rect = mapRef.current?.getBoundingClientRect();
      const first = event.touches[0];
      const second = event.touches[1];
      pinchRef.current = {
        distance: touchDistance(first, second),
        zoom: view.zoom,
        centerWorld,
        midpoint: rect ? {
          x: (((first.clientX + second.clientX) / 2 - rect.left) / rect.width) * width,
          y: (((first.clientY + second.clientY) / 2 - rect.top) / rect.height) * height
        } : { x: width / 2, y: height / 2 }
      };
      dragRef.current = undefined;
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.touches.length === 1 && dragRef.current) {
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      panBy(((event.touches[0].clientX - dragRef.current.x) / rect.width) * width, ((event.touches[0].clientY - dragRef.current.y) / rect.height) * height, dragRef.current.centerWorld);
      return;
    }

    if (event.touches.length === 2 && pinchRef.current) {
      const nextZoom = clamp(pinchRef.current.zoom + Math.log2(touchDistance(event.touches[0], event.touches[1]) / pinchRef.current.distance), minZoom, maxZoom);
      const anchor = worldToLatLng(pinchRef.current.centerWorld.x + pinchRef.current.midpoint.x - width / 2, pinchRef.current.centerWorld.y + pinchRef.current.midpoint.y - height / 2, pinchRef.current.zoom);
      const anchorWorld = latLngToWorld(anchor.latitude, anchor.longitude, nextZoom);
      setView({
        center: worldToLatLng(anchorWorld.x - pinchRef.current.midpoint.x + width / 2, anchorWorld.y - pinchRef.current.midpoint.y + height / 2, nextZoom),
        zoom: nextZoom
      });
    }
  };

  return (
    <div
      className={`relative min-h-[28rem] touch-none overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${className}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={finishDrag}
      onMouseMove={handleMouseMove}
      onMouseUp={finishDrag}
      onTouchCancel={finishDrag}
      onTouchEnd={finishDrag}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onWheel={handleWheel}
      ref={mapRef}
      role="application"
    >
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
      <svg className="absolute inset-0 size-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {segmentPolygons.map(({ points, segment }) => {
          const selected = selectedSegmentId === segment.id;

          return (
            <polygon
              className="cursor-pointer transition"
              fill={selected ? "rgba(0, 59, 131, 0.24)" : "rgba(0, 59, 131, 0.12)"}
              key={segment.id}
              onClick={(event) => {
                event.stopPropagation();
                onSegmentSelect(segment);
              }}
              points={points}
              stroke={selected ? "#003B83" : "#0f6fad"}
              strokeDasharray={selected ? undefined : "8 5"}
              strokeLinejoin="round"
              strokeWidth={selected ? 4 : 3}
            />
          );
        })}
        {segmentPolygons.map(({ center, segment }) => {
          const position = pointToViewport(center.latitude, center.longitude, centerWorld, width, height, view.zoom);

          return (
            <text
              className="pointer-events-none select-none text-[13px] font-black"
              fill="#003B83"
              key={`${segment.id}-label`}
              stroke="white"
              strokeLinejoin="round"
              strokeWidth={4}
              style={{ paintOrder: "stroke" }}
              textAnchor="middle"
              x={position.x}
              y={position.y}
            >
              {segment.number}
            </text>
          );
        })}
      </svg>
      <svg className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {path && <polyline fill="none" points={path} stroke="#003B83" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="5" />}
      </svg>
      {stops.map((stop) => {
        const position = pointToViewport(stop.prospect.latitude, stop.prospect.longitude, centerWorld, width, height, view.zoom);
        const selected = selectedStopId === stop.id;

        return (
          <button
            key={stop.id}
            className={`absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-sm font-black text-white shadow-lg transition hover:scale-110 ${markerColor(stop.prospect.status)} ${selected ? "ring-4 ring-blue-200" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(stop);
            }}
            style={{ left: `${(position.x / width) * 100}%`, top: `${(position.y / height) * 100}%` }}
            title={`${stop.sequence}. ${stop.prospect.name} - ${address(stop.prospect)}`}
            type="button"
          >
            {stop.sequence}
          </button>
        );
      })}
      {title && <div className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-2 text-xs font-black text-slate-700 shadow">{title}</div>}
      <PstMapControls onClose={onClose} onFullscreen={onFullscreen} onReset={onReset} onZoomIn={() => zoomBy(1)} onZoomOut={() => zoomBy(-1)} />
      {emptyMessage && stops.length === 0 && segments.length === 0 && (
        <div className="absolute inset-x-4 top-20 mx-auto max-w-xl rounded-lg border border-blue-100 bg-white/95 px-4 py-3 text-center text-sm font-semibold text-[#003B83] shadow">
          {emptyMessage}
        </div>
      )}
      {selectedSegment && <PstSegmentPopup onOpen={onSegmentOpen} segment={selectedSegment} />}
      {selectedStop && <PstMarkerPopup stop={selectedStop} t={t} />}
      <div className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-1 text-[0.65rem] font-semibold text-slate-600 shadow">© OpenStreetMap contributors</div>
    </div>
  );
}

export function PstMapFullscreen({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 p-3 md:p-6">
      <div className="h-full overflow-hidden rounded-lg bg-white shadow-2xl">{children}</div>
      <button className="absolute right-5 top-5 grid size-10 place-items-center rounded-md bg-white text-slate-900 shadow-lg" onClick={onClose} title="Sluiten" type="button">
        <X aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

export function PstMapControls({
  onClose,
  onFullscreen,
  onReset,
  onZoomIn,
  onZoomOut
}: {
  onClose?: () => void;
  onFullscreen: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <>
      <div className="absolute left-3 top-14 grid gap-2">
        <button className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white text-[#003B83] shadow transition hover:bg-blue-50" onClick={onZoomIn} title="Inzoomen" type="button">
          <Plus aria-hidden="true" size={18} />
        </button>
        <button className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white text-[#003B83] shadow transition hover:bg-blue-50" onClick={onZoomOut} title="Uitzoomen" type="button">
          <Minus aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
        <button className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-black text-[#003B83] shadow transition hover:bg-blue-50" onClick={onReset} type="button">
          <LocateFixed aria-hidden="true" size={15} />
          Toon alles
        </button>
        <button className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-black text-[#003B83] shadow transition hover:bg-blue-50" onClick={onFullscreen} type="button">
          <Maximize2 aria-hidden="true" size={15} />
          Volledig scherm
        </button>
        {onClose && (
          <button className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow transition hover:bg-slate-50" onClick={onClose} title="Sluiten" type="button">
            <X aria-hidden="true" size={17} />
          </button>
        )}
      </div>
    </>
  );
}

export function PstMarkerPopup({ stop, t }: { stop: PstMapStop; t: TranslationFn }) {
  return (
    <div className="absolute bottom-4 left-4 max-w-sm rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-xl">
      <p className="font-black">{stop.sequence}. {stop.prospect.name}</p>
      <p className="mt-1 text-xs text-slate-600">{address(stop.prospect)}</p>
      <p className="mt-2 text-xs font-semibold text-slate-500">{t(`pst.prospectStatus.${stop.prospect.status}`)}</p>
    </div>
  );
}

export function PstSegmentPopup({ onOpen, segment }: { onOpen?: (id: string) => void; segment: PstMapSegment }) {
  return (
    <div className="absolute bottom-4 left-4 max-w-sm rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-xl">
      <p className="font-black">{segment.number}</p>
      <p className="mt-1 text-xs font-semibold text-slate-700">{segment.description}</p>
      <div className="mt-3 grid gap-1 text-xs text-slate-600">
        <p><span className="font-bold text-slate-800">Regio:</span> {segment.region}</p>
        <p><span className="font-bold text-slate-800">Sector:</span> {segment.sectorCode} {segment.sectorName}</p>
        <p><span className="font-bold text-slate-800">Adreslijnen:</span> {segment.addressLineCount ?? 0}</p>
        <p><span className="font-bold text-slate-800">Status:</span> {segment.status}</p>
      </div>
      {onOpen && (
        <button className="mt-3 min-h-8 rounded-md bg-[#003B83] px-3 text-xs font-bold text-white" onClick={() => onOpen(segment.id)} type="button">Openen</button>
      )}
    </div>
  );
}

export function PstStopDetailsModal({ onClose, onVisitActions, stop, t }: { onClose: () => void; onVisitActions: () => void; stop: PstMapStop; t: TranslationFn }) {
  const rows = [
    ["Naam", stop.prospect.name],
    ["Adres", address(stop.prospect)],
    ["Segment", stop.segmentName],
    ["Vertegenwoordiger", stop.representativeName],
    ["Status", t(`pst.prospectStatus.${stop.prospect.status}`)],
    ["Laatste bezoek", stop.prospect.lastVisitedAt ? formatDateTime(stop.prospect.lastVisitedAt) : undefined],
    ["Routevolgnummer", String(stop.sequence)],
    ["Afstand", stop.calculatedDistanceFromPreviousKm ? `${stop.calculatedDistanceFromPreviousKm.toFixed(1)} km` : undefined],
    ["Reistijd", stop.calculatedTravelTimeFromPreviousMin ? `${stop.calculatedTravelTimeFromPreviousMin} min` : undefined]
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4">
      <article className="w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h3 className="text-lg font-black">{stop.prospect.name}</h3>
            <p className="text-xs text-slate-600">{address(stop.prospect)}</p>
          </div>
          <button className="grid size-9 place-items-center rounded-md border border-slate-200" onClick={onClose} title="Sluiten" type="button">
            <X aria-hidden="true" size={17} />
          </button>
        </div>
        <div className="grid gap-3 p-4 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[9rem_1fr] gap-3">
              <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
          <button className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold" onClick={onClose} type="button">Sluiten</button>
          <button className="min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white" onClick={onVisitActions} type="button">Bezoekacties</button>
        </div>
      </article>
    </div>
  );
}

export function PstVisitActionsModal({ onClose, stop }: { onClose: () => void; stop: PstMapStop }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
      <article className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h3 className="text-lg font-black">Bezoekacties</h3>
            <p className="text-xs text-slate-600">{stop.prospect.name}</p>
          </div>
          <button className="grid size-9 place-items-center rounded-md border border-slate-200" onClick={onClose} title="Sluiten" type="button">
            <X aria-hidden="true" size={17} />
          </button>
        </div>
        <div className="grid gap-3 p-4">
          {["Markeer bezocht", "Markeer niet bezocht", "Plan bezoek", "Voeg opmerking toe", "Open prospectdetail"].map((label) => (
            <button key={label} className="min-h-10 rounded-md border border-slate-200 px-4 text-left text-sm font-bold transition hover:bg-blue-50" type="button">{label}</button>
          ))}
        </div>
      </article>
    </div>
  );
}

function markerColor(status: PstProspect["status"]) {
  if (status === "visited") {
    return "bg-slate-400 opacity-80";
  }

  if (status === "planned") {
    return "bg-emerald-600";
  }

  return "bg-[#003B83]";
}

function getFeatureBounds(stops: PstMapStop[], segments: PstMapSegment[]) {
  const points = [
    ...stops.map((stop) => ({ latitude: stop.prospect.latitude, longitude: stop.prospect.longitude })),
    ...segments.flatMap((segment) => getSegmentPoints(segment))
  ];

  if (points.length === 0) {
    return {
      center: { latitude: 48.1372, longitude: 11.5756 },
      east: 11.5756,
      north: 48.1372,
      south: 48.1372,
      west: 11.5756
    };
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const north = Math.max(...latitudes);
  const south = Math.min(...latitudes);
  const east = Math.max(...longitudes);
  const west = Math.min(...longitudes);

  return {
    center: {
      latitude: (north + south) / 2,
      longitude: (east + west) / 2
    },
    east,
    north,
    south,
    west
  };
}

function getSegmentBounds(segment: PstMapSegment) {
  return getFeatureBounds([], [segment]);
}

function fitViewForFeatures(stops: PstMapStop[], segments: PstMapSegment[], width: number, height: number, minZoom: number, maxZoom: number): MapView {
  const bounds = getFeatureBounds(stops, segments);
  const pointCount = stops.length + segments.flatMap((segment) => getSegmentPoints(segment)).length;

  if (pointCount <= 1) {
    return {
      center: bounds.center,
      zoom: 14
    };
  }

  const padding = 72;
  let zoom = maxZoom;

  for (let candidate = maxZoom; candidate >= minZoom; candidate--) {
    const northwest = latLngToWorld(bounds.north, bounds.west, candidate);
    const southeast = latLngToWorld(bounds.south, bounds.east, candidate);

    if (Math.abs(southeast.x - northwest.x) <= width - padding * 2 && Math.abs(southeast.y - northwest.y) <= height - padding * 2) {
      zoom = candidate;
      break;
    }
  }

  return {
    center: bounds.center,
    zoom
  };
}

function getSegmentPoints(segment: PstMapSegment) {
  return (segment.boundaryGeoJson?.coordinates ?? [])
    .flat()
    .map(([longitude, latitude]) => ({ latitude, longitude }));
}

function polygonToViewportPoints(segment: PstMapSegment, centerWorld: { x: number; y: number }, width: number, height: number, zoom: number) {
  return (segment.boundaryGeoJson?.coordinates[0] ?? [])
    .map(([longitude, latitude]) => {
      const position = pointToViewport(latitude, longitude, centerWorld, width, height, zoom);
      return `${position.x},${position.y}`;
    })
    .join(" ");
}

function createTiles(centerTileX: number, centerTileY: number, centerWorld: { x: number; y: number }, width: number, height: number, zoom: number) {
  const tiles: Array<{ x: number; y: number; left: number; top: number }> = [];
  const maxTile = 2 ** zoom;

  for (let xOffset = -2; xOffset <= 2; xOffset++) {
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

function worldToLatLng(x: number, y: number, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const longitude = (x / scale) * 360 - 180;
  const latitudeRadians = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale)));

  return {
    latitude: (latitudeRadians * 180) / Math.PI,
    longitude
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function touchDistance(first: Touch, second: Touch) {
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function address(prospect: PstProspect) {
  return `${prospect.street}, ${prospect.postalCode} ${prospect.city}`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
