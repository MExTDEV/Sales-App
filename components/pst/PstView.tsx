"use client";

import { Badge } from "@/components/shared/ui";
import { PstMap, type PstMapStop } from "@/components/pst/PstMap";
import { canAccessPst, canManagePst } from "@/domain/pst/access";
import { calculateTotalDistance, estimateTravelTime, optimizeRoute, type OptimizedRouteStop, type RoutePoint } from "@/lib/pstRouteOptimizationService";
import { CalendarDays, Copy, ExternalLink, Map, Route, Trash2, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import type { AppView, MockUser, PstApproval, PstProspect, PstRepresentative, PstRoute, PstRouteStop, PstRouteStatus, PstSegment, PstSegmentStatus, PstVisit, TranslationFn } from "@/types/sales";

type SegmentTab = "info" | "prospects" | "routes" | "history";
type PstScreen = Extract<AppView, "pstDashboard" | "pstSegments" | "pstRoutes" | "pstProspection" | "pstMaps" | "pstApprovals" | "pstRepresentatives" | "pstPlanning" | "pstQuality">;

export function PstView({
  approvals,
  prospects,
  representatives,
  routeStops,
  routes,
  screen,
  segments,
  t,
  user,
  visits
}: {
  approvals: PstApproval[];
  prospects: PstProspect[];
  representatives: PstRepresentative[];
  routeStops: PstRouteStop[];
  routes: PstRoute[];
  screen: PstScreen;
  segments: PstSegment[];
  t: TranslationFn;
  user: MockUser;
  visits: PstVisit[];
}) {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();
  const [selectedRouteId, setSelectedRouteId] = useState<string>();
  const [segmentTab, setSegmentTab] = useState<SegmentTab>("info");
  const [completedSegmentIds, setCompletedSegmentIds] = useState<string[]>([]);
  const selectedSegment = segments.find((segment) => segment.id === selectedSegmentId);
  const selectedRoute = routes.find((routeItem) => routeItem.id === selectedRouteId);

  if (selectedSegment) {
    return (
      <SegmentDetail
        approvals={approvals}
        prospects={prospects}
        routes={routes}
        segment={selectedSegment}
        tab={segmentTab}
        t={t}
        onBack={() => setSelectedSegmentId(undefined)}
        onTab={setSegmentTab}
      />
    );
  }

  if (selectedRoute) {
    return (
      <RouteDetail
        prospects={prospects}
        route={selectedRoute}
        stops={routeStops}
        t={t}
        onBack={() => setSelectedRouteId(undefined)}
      />
    );
  }

  return (
    <section className="grid gap-4">
      {screen === "pstDashboard" && (
        <Dashboard
          completedSegmentIds={completedSegmentIds}
          prospects={prospects}
          routes={routes}
          segments={segments}
          t={t}
          user={user}
          visits={visits}
          onComplete={(segmentId) => {
            setCompletedSegmentIds((current) => Array.from(new Set([...current, segmentId])));
          }}
          onOpen={(id) => {
            setSelectedSegmentId(id);
            setSegmentTab("info");
          }}
        />
      )}
      {screen === "pstSegments" && <SegmentsList prospects={prospects} segments={segments} t={t} user={user} onOpen={(id) => { setSelectedSegmentId(id); setSegmentTab("info"); }} />}
      {screen === "pstRoutes" && <RoutesList prospects={prospects} routes={routes} routeStops={routeStops} segments={segments} t={t} onOpen={setSelectedRouteId} />}
      {screen === "pstProspection" && <Prospection prospects={prospects} segments={segments} t={t} />}
      {screen === "pstMaps" && <MapsView prospects={prospects} representatives={representatives} segments={segments} t={t} />}
      {screen === "pstApprovals" && <Approvals approvals={approvals} canManage={canManagePst(user)} t={t} />}
      {screen === "pstRepresentatives" && <Representatives prospects={prospects} representatives={representatives} routes={routes} segments={segments} t={t} />}
      {screen === "pstPlanning" && <Planning prospects={prospects} routeStops={routeStops} routes={routes} segments={segments} t={t} />}
      {screen === "pstQuality" && <Quality prospects={prospects} routeStops={routeStops} routes={routes} segments={segments} t={t} />}
    </section>
  );
}

function Dashboard({
  completedSegmentIds,
  prospects,
  routes,
  segments,
  t,
  user,
  visits,
  onComplete,
  onOpen
}: {
  completedSegmentIds: string[];
  prospects: PstProspect[];
  routes: PstRoute[];
  segments: PstSegment[];
  t: TranslationFn;
  user: MockUser;
  visits: PstVisit[];
  onComplete: (segmentId: string) => void;
  onOpen: (segmentId: string) => void;
}) {
  const today = "2026-05-30";
  const openSegments = segments.filter((segment) => isOpenSegmentForUser(segment, user, completedSegmentIds));
  const cards = [
    { icon: Map, label: t("pst.dashboard.activeSegments"), value: String(openSegments.length) },
    { icon: UsersRound, label: t("pst.dashboard.openProspects"), value: String(prospects.filter((prospect) => prospect.status !== "visited").length) },
    { icon: CalendarDays, label: t("pst.dashboard.visitsToday"), value: String(visits.filter((visit) => visit.visitedAt.startsWith(today)).length) },
    { icon: Route, label: t("pst.dashboard.routesToday"), value: String(routes.filter((routeItem) => routeItem.date === today).length) }
  ];
  const completeSegment = (segment: PstSegment) => {
    const confirmed = window.confirm("Ben je zeker dat je dit segment volledig als afgewerkt wil markeren?");

    if (confirmed) {
      onComplete(segment.id);
    }
  };

  return (
    <>
      <Header title={t("pst.dashboard.title")} aside="Prospection & Segment Tracking" />
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-md bg-sky-100 text-[#003B83]">
                  <Icon aria-hidden="true" size={19} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs text-slate-600">{card.label}</p>
                  <p className="text-xl font-black">{card.value}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="font-black">Open segmenten</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[76rem] border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {["Segmentnummer", "Omschrijving", "Sector", "Regio", "Geplande datum", "Aantal adreslijnen", "Status", "Acties"].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-left text-xs font-black uppercase text-slate-600">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openSegments.map((segment) => {
                const addressLineCount = prospects.filter((prospect) => prospect.segmentId === segment.id).length;

                return (
                  <tr key={segment.id} className="border-t border-slate-200">
                    <td className="px-3 py-3 text-sm font-bold text-[#003B83]">{segment.number}</td>
                    <td className="px-3 py-3 text-sm">{segment.description}</td>
                    <td className="px-3 py-3 text-sm">{segment.sectorCode} {segment.sectorName}</td>
                    <td className="px-3 py-3 text-sm">{segment.region}</td>
                    <td className="px-3 py-3 text-sm">{segment.plannedDate}</td>
                    <td className="px-3 py-3 text-right text-sm">{addressLineCount}</td>
                    <td className="px-3 py-3"><OpenSegmentStatusBadge status={segment.status} /></td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <OpenButton label={t("common.open")} onClick={() => onOpen(segment.id)} />
                        <button className="min-h-8 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100" onClick={() => completeSegment(segment)} type="button">Afgewerkt</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {openSegments.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-sm text-slate-600" colSpan={8}>Geen open segmenten.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">{t("pst.dashboard.recentVisits")}</h3>
          <button className="text-sm font-bold text-[#003B83]">{t("pst.dashboard.allProspects")} {"->"}</button>
        </div>
        <div className="divide-y divide-slate-200">
          {visits.map((visit) => (
            <div key={visit.id} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-semibold">{visit.prospectName}</p>
                <p className="text-xs text-slate-600">{visit.representativeName} · {t(`pst.prospectStatus.${visit.status}`)}</p>
              </div>
              <p className="text-xs text-slate-700">{formatDateTime(visit.visitedAt)}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

function SegmentsList({ prospects, segments, t, user, onOpen }: { prospects: PstProspect[]; segments: PstSegment[]; t: TranslationFn; user: MockUser; onOpen: (id: string) => void }) {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();
  const [showAllSegments, setShowAllSegments] = useState(false);
  const visibleSegments = segments.filter((segment) => canViewPstSegment(segment, user));
  const mapSegments = visibleSegments.map((segment) => ({
    ...segment,
    addressLineCount: prospects.filter((prospect) => prospect.segmentId === segment.id).length
  }));
  const selectedSegment = selectedSegmentId ? mapSegments.find((segment) => segment.id === selectedSegmentId) : undefined;
  const displayedMapSegments = showAllSegments ? mapSegments : selectedSegment ? [selectedSegment] : [];
  const selectSegmentOnMap = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
    setShowAllSegments(false);
  };

  return (
    <>
      <Header title={t("pst.segments.title")} action={t("pst.segments.new")} />
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#003B83]">
        Selecteer een segment in de lijst om het op de kaart te tonen.
      </div>
      <PstMap
        centerOnSelect
        emptyMessage="Selecteer een segment in de lijst om het op de kaart te tonen."
        onSegmentOpen={onOpen}
        onSegmentSelect={selectSegmentOnMap}
        onShowAll={() => setShowAllSegments(true)}
        selectedSegmentId={selectedSegmentId}
        segments={displayedMapSegments}
        stops={[]}
        t={t}
        title={t("pst.segments.title")}
      />
      <p className="text-sm font-semibold text-slate-600">Klik op een segment om het op de kaart te tonen. Gebruik 'Openen' om de details te bekijken.</p>
      <Table>
        <thead>
          <tr>
            {[t("pst.segment.number"), t("pst.segment.description"), t("pst.segment.sector"), t("pst.segment.region"), t("pst.segment.planned"), t("pst.segment.prospectCount"), t("pst.segment.status"), ""].map((heading) => (
              <th key={heading} className="px-3 py-3 text-left text-xs font-black uppercase text-slate-600">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleSegments.map((segment) => (
            <tr key={segment.id} className={`cursor-pointer border-t border-slate-200 transition ${selectedSegmentId === segment.id ? "bg-blue-50" : "hover:bg-slate-50"}`} onClick={() => selectSegmentOnMap(segment.id)}>
              <td className="px-3 py-3 text-sm font-bold text-[#003B83]">{segment.number}</td>
              <td className="px-3 py-3 text-sm">{segment.description}</td>
              <td className="px-3 py-3 text-sm">{segment.sectorCode} {segment.sectorName}</td>
              <td className="px-3 py-3 text-sm">{segment.region}</td>
              <td className="px-3 py-3 text-sm">{segment.plannedDate}</td>
              <td className="px-3 py-3 text-right text-sm">{prospects.filter((prospect) => prospect.segmentId === segment.id).length}</td>
              <td className="px-3 py-3"><SegmentStatusBadge status={segment.status} t={t} /></td>
              <td className="px-3 py-3 text-right"><OpenButton label={t("common.open")} onClick={() => onOpen(segment.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function SegmentDetail({ approvals, prospects, routes, segment, tab, t, onBack, onTab }: { approvals: PstApproval[]; prospects: PstProspect[]; routes: PstRoute[]; segment: PstSegment; tab: SegmentTab; t: TranslationFn; onBack: () => void; onTab: (tab: SegmentTab) => void }) {
  const [selectedProspectStopId, setSelectedProspectStopId] = useState<string>();
  const segmentProspects = prospects.filter((prospect) => prospect.segmentId === segment.id);
  const segmentRoutes = routes.filter((routeItem) => routeItem.segmentId === segment.id);
  const segmentMapStops = toMapStops(segmentProspects, [segment], segmentRoutes);
  const detailTabs: Array<{ id: SegmentTab; label: string }> = [
    { id: "info", label: t("pst.segmentDetail.info") },
    { id: "prospects", label: `${t("pst.segmentDetail.prospects")} (${segmentProspects.length})` },
    { id: "routes", label: `${t("pst.segmentDetail.routes")} (${segmentRoutes.length})` },
    { id: "history", label: t("pst.segmentDetail.history") }
  ];

  return (
    <section className="grid gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button className="mb-2 text-xs font-bold text-[#003B83]" onClick={onBack}>{"<-"} {t("pst.segmentDetail.back")}</button>
          <h2 className="text-2xl font-black">{segment.number} <span className="font-normal text-slate-600">-- {segment.description}</span></h2>
        </div>
        <div className="flex gap-2">
          <IconButton icon={Copy} label={t("pst.segmentDetail.duplicate")} />
          <IconButton icon={Trash2} label={t("pst.segmentDetail.archive")} />
          <button className="min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white">{t("common.edit")}</button>
        </div>
      </div>
      <article className="rounded-lg border border-slate-200 bg-white">
        <div className="flex gap-1 border-b border-slate-200 px-4">
          {detailTabs.map((item) => (
            <button key={item.id} className={`min-h-11 border-b-2 px-3 text-sm ${tab === item.id ? "border-[#003B83] font-black" : "border-transparent text-slate-600"}`} onClick={() => onTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "info" && (
            <div className="grid gap-x-24 gap-y-5 md:grid-cols-2">
              <Info label={t("pst.segment.status")} value={t(`pst.segmentStatus.${segment.status}`)} />
              <Info label={t("pst.segment.planned")} value={segment.plannedDate} />
              <Info label={t("pst.segment.sectorNumber")} value={segment.sectorCode} />
              <Info label={t("pst.segment.sectorName")} value={segment.sectorName} />
              <Info label={t("pst.segment.region")} value={segment.region} />
              <Info label={t("pst.segment.representative")} value={segment.representativeName} />
              <Info label={t("pst.segment.prospectCount")} value={String(segmentProspects.length)} />
              <Info label={t("pst.segment.approvalCount")} value={String(approvals.filter((approval) => approval.projectId === segment.id).length)} />
              <Info label={t("pst.segment.notes")} value={segment.notes} />
            </div>
          )}
          {tab === "prospects" && (
            <div>
              <div className="mb-4 flex justify-between"><h3 className="font-black">{t("pst.segmentDetail.prospectsInSegment")}</h3><button className="text-sm font-bold text-[#003B83]">+ {t("pst.segmentDetail.addProspect")}</button></div>
              <Rows>
                {segmentMapStops.map((stop) => (
                  <button key={stop.id} className={`grid w-full gap-2 py-3 text-left text-sm md:grid-cols-[1fr_auto] ${selectedProspectStopId === stop.id ? "rounded-md bg-blue-50 px-3" : ""}`} onClick={() => setSelectedProspectStopId(stop.id)} type="button">
                    <div><p className="font-semibold text-[#003B83]">{stop.prospect.name}</p><p className="text-xs text-slate-600">{address(stop.prospect)}</p></div>
                    <ProspectStatusBadge status={stop.prospect.status} t={t} />
                  </button>
                ))}
              </Rows>
              <div className="mt-4">
                <PstMap centerOnSelect stops={segmentMapStops} selectedStopId={selectedProspectStopId} t={t} title={segment.number} onSelect={setSelectedProspectStopId} />
              </div>
            </div>
          )}
          {tab === "routes" && (segmentRoutes.length ? <Rows>{segmentRoutes.map((routeItem) => <p key={routeItem.id} className="py-3 text-sm">{routeItem.name}</p>)}</Rows> : <p className="text-sm text-slate-700">{t("pst.segmentDetail.noRoutes")}</p>)}
          {tab === "history" && (
            <div className="grid gap-2 text-sm text-slate-700">
              <p>{t("pst.history.created")} {formatDateTime(segment.createdAt)}</p>
              <p>{t("pst.history.updated")} {formatDateTime(segment.updatedAt)}</p>
              <p>{t("pst.history.statusChanged")} {t(`pst.segmentStatus.${segment.status}`)}</p>
              <p>{t("pst.history.prospectAdded")}</p>
              <p>{t("pst.history.prospectVisited")}</p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function RoutesList({ prospects, routeStops, routes, segments, t, onOpen }: { prospects: PstProspect[]; routeStops: PstRouteStop[]; routes: PstRoute[]; segments: PstSegment[]; t: TranslationFn; onOpen: (id: string) => void }) {
  const routeMapStops = toMapStopsFromRouteStops(routeStops, prospects, segments, routes);

  return (
    <>
      <Header title={t("pst.routes.title")} action={t("pst.routes.new")} />
      <PstMap stops={routeMapStops} t={t} title={t("pst.routes.title")} />
      <Table>
        <thead>
          <tr>
            {[t("pst.route.number"), t("pst.route.name"), t("pst.route.representative"), t("pst.route.date"), t("pst.route.stops"), t("pst.route.distance"), t("pst.route.status"), ""].map((heading) => (
              <th key={heading} className="px-3 py-3 text-left text-xs font-black uppercase text-slate-600">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {routes.map((routeItem) => (
            <tr key={routeItem.id} className="border-t border-slate-200">
              <td className="px-3 py-3 text-sm">{routeItem.number}</td>
              <td className="px-3 py-3 text-sm">{routeItem.name}</td>
              <td className="px-3 py-3 text-sm">{routeItem.representativeName}</td>
              <td className="px-3 py-3 text-sm">{routeItem.date}</td>
              <td className="px-3 py-3 text-sm">{routeStops.filter((stop) => stop.routeId === routeItem.id).length}</td>
              <td className="px-3 py-3 text-sm">{routeItem.totalDistanceKm ? `${routeItem.totalDistanceKm.toFixed(1)} km` : "-"}</td>
              <td className="px-3 py-3"><RouteStatusBadge status={routeItem.status} t={t} /></td>
              <td className="px-3 py-3 text-right"><OpenButton label={t("common.open")} onClick={() => onOpen(routeItem.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function RouteDetail({ prospects, route, stops, t, onBack }: { prospects: PstProspect[]; route: PstRoute; stops: PstRouteStop[]; t: TranslationFn; onBack: () => void }) {
  const [selectedStopId, setSelectedStopId] = useState<string>();
  const routePoints = useMemo(() => createRoutePoints(route, stops, prospects), [prospects, route, stops]);
  const optimizedStops = useMemo(() => optimizeRoute(routePoints, route.startLocation), [route.startLocation, routePoints]);
  const routeMapStops = toMapStopsFromOptimized(optimizedStops, [], [route]);
  const selectedOrFirstStopId = selectedStopId ?? optimizedStops[0]?.id;
  const totalDistanceKm = route.totalDistanceKm ?? calculateTotalDistance(optimizedStops);
  const estimatedTravelTimeMin = route.estimatedTravelTimeMin ?? estimateTravelTime(totalDistanceKm);
  const firstStop = optimizedStops[0]?.prospect;
  const lastStop = optimizedStops[optimizedStops.length - 1]?.prospect;
  const startAddress = route.startAddress ?? route.startLocation?.label ?? (firstStop ? address(firstStop) : "-");
  const endAddress = route.endAddress ?? route.endLocation?.label ?? (lastStop ? address(lastStop) : "-");

  return (
    <section className="grid gap-4">
      <div className="flex items-start justify-between">
        <div>
          <button className="mb-2 text-xs font-bold text-[#003B83]" onClick={onBack}>{"<-"} {t("pst.routeDetail.back")}</button>
          <h2 className="text-2xl font-black">{route.name}</h2>
          <p className="text-sm text-slate-600">{t("pst.route.number")}: {route.number}</p>
        </div>
        <RouteStatusBadge status={route.status} t={t} />
      </div>
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-5 md:grid-cols-4">
          <Info label={t("pst.route.segment")} value={route.segmentId ?? "-"} />
          <Info label={t("pst.route.representative")} value={route.representativeName} />
          <Info label={t("pst.route.date")} value={route.date} />
          <Info label={t("pst.route.stops")} value={String(optimizedStops.length)} />
          <Info label={t("pst.route.distance")} value={`${totalDistanceKm.toFixed(1)} km`} />
          <Info label={t("pst.route.travelTime")} value={`${estimatedTravelTimeMin} min`} />
          <Info label={t("pst.route.start")} value={startAddress} />
          <Info label={t("pst.route.end")} value={endAddress} />
        </div>
      </article>
      <div className="grid gap-4 xl:grid-cols-[1fr_32rem]">
        <PstMap centerOnSelect stops={routeMapStops} selectedStopId={selectedStopId} t={t} title={route.number} onSelect={setSelectedStopId} />
        <article className="max-h-[30rem] overflow-y-auto rounded-lg border border-slate-200 bg-white">
          <h3 className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4 text-sm font-black uppercase">{t("pst.routeDetail.stops")} ({optimizedStops.length})</h3>
          {optimizedStops.map((stop) => (
            <button
              key={stop.id}
              className={`flex w-full gap-3 border-b border-slate-200 p-4 text-left transition hover:bg-blue-50 ${stop.prospect.status === "visited" ? "bg-slate-50 text-slate-500" : "bg-white text-slate-950"} ${selectedOrFirstStopId === stop.id ? "ring-2 ring-inset ring-blue-200" : ""}`}
              onClick={() => setSelectedStopId(stop.id)}
            >
              <span className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-black text-white ${markerColor(stop.prospect.status)}`}>{stop.sequence}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{stop.prospect.name}</p>
                  <ProspectStatusBadge status={stop.prospect.status} t={t} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{address(stop.prospect)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {stop.sequence === 1 ? t("pst.routeDetail.firstStop") : `${stop.calculatedDistanceFromPreviousKm.toFixed(1)} km · ${stop.calculatedTravelTimeFromPreviousMin} min`}
                </p>
              </div>
            </button>
          ))}
        </article>
      </div>
    </section>
  );
}

function Prospection({ prospects, segments, t }: { prospects: PstProspect[]; segments: PstSegment[]; t: TranslationFn }) {
  const [selectedStopId, setSelectedStopId] = useState<string>();
  const mapStops = toMapStops(prospects, segments);

  return (
    <>
      <Header title={t("pst.prospection.title")} />
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input className="min-h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder={t("pst.prospection.search")} />
          <select className="min-h-10 rounded-md border border-slate-300 px-3 text-sm"><option>{t("pst.prospectStatus.bezocht")}</option><option>{t("pst.prospectStatus.niet_bezocht")}</option><option>{t("pst.prospectStatus.ingepland")}</option></select>
        </div>
        <div className="mb-4">
          <PstMap centerOnSelect stops={mapStops} selectedStopId={selectedStopId} t={t} title={t("pst.prospection.title")} onSelect={setSelectedStopId} />
        </div>
        <Rows>{mapStops.map((stop) => {
          const prospect = stop.prospect;
          return (
            <button key={stop.id} className={`grid w-full gap-2 py-3 text-left text-sm md:grid-cols-[1fr_12rem_12rem_10rem] ${selectedStopId === stop.id ? "rounded-md bg-blue-50 px-3" : ""}`} onClick={() => setSelectedStopId(stop.id)} type="button">
              <span>{prospect.name}<br /><span className="text-xs text-slate-600">{address(prospect)}</span></span>
              <span>{segments.find((segment) => segment.id === prospect.segmentId)?.number}</span>
              <span>{segments.find((segment) => segment.id === prospect.segmentId)?.representativeName}</span>
              <ProspectStatusBadge status={prospect.status} t={t} />
            </button>
          );
        })}</Rows>
      </article>
    </>
  );
}

function MapsView({ prospects, representatives, segments, t }: { prospects: PstProspect[]; representatives: PstRepresentative[]; segments: PstSegment[]; t: TranslationFn }) {
  const [representativeId, setRepresentativeId] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const filteredProspects = prospects.filter((prospect) => {
    const segment = segments.find((item) => item.id === prospect.segmentId);

    if (representativeId && prospect.assignedRepresentativeId !== representativeId && segment?.representativeId !== representativeId) {
      return false;
    }

    if (region && segment?.region !== region) {
      return false;
    }

    if (status && prospect.status !== status) {
      return false;
    }

    return true;
  });

  return (
    <>
      <Header title={t("pst.maps.title")} />
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <select className="min-h-10 rounded-md border border-slate-300 px-3 text-sm" value={representativeId} onChange={(event) => setRepresentativeId(event.target.value)}><option value="">{t("pst.route.representative")}</option>{representatives.map((rep) => <option key={rep.id} value={rep.id}>{rep.name}</option>)}</select>
          <select className="min-h-10 rounded-md border border-slate-300 px-3 text-sm" value={region} onChange={(event) => setRegion(event.target.value)}><option value="">{t("pst.segment.region")}</option>{Array.from(new Set(segments.map((segment) => segment.region))).map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select className="min-h-10 rounded-md border border-slate-300 px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">{t("pst.field.status")}</option><option value="visited">{t("pst.prospectStatus.visited")}</option><option value="not_visited">{t("pst.prospectStatus.not_visited")}</option><option value="planned">{t("pst.prospectStatus.planned")}</option></select>
          <input className="min-h-10 rounded-md border border-slate-300 px-3 text-sm" type="date" />
        </div>
        <PstMap stops={toMapStops(filteredProspects, segments)} t={t} title={t("pst.maps.title")} />
      </article>
    </>
  );
}

function Approvals({ approvals, canManage, t }: { approvals: PstApproval[]; canManage: boolean; t: TranslationFn }) {
  return (
    <>
      <Header title={t("pst.approvals.title")} />
      <Rows>{approvals.map((approval) => <div key={approval.id} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_auto_auto]"><span>{approval.approvalType}<br /><span className="text-xs text-slate-600">{approval.projectId} · {approval.assignedToName}</span></span><Badge tone={approval.status === "pending" ? "amber" : "green"}>{t(`pst.approvalStatus.${approval.status}`)}</Badge><button disabled={!canManage} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40">{t("common.open")}</button></div>)}</Rows>
    </>
  );
}

function Representatives({ prospects, representatives, routes, segments, t }: { prospects: PstProspect[]; representatives: PstRepresentative[]; routes: PstRoute[]; segments: PstSegment[]; t: TranslationFn }) {
  return (
    <>
      <Header title={t("pst.representatives.title")} />
      <Rows>{representatives.map((rep) => <div key={rep.id} className="grid gap-2 py-3 text-sm md:grid-cols-5"><span className="font-semibold">{rep.name}</span><span>{rep.region}</span><span>{segments.filter((segment) => segment.representativeId === rep.id && segment.status !== "afgewerkt").length}</span><span>{prospects.filter((prospect) => segments.some((segment) => segment.id === prospect.segmentId && segment.representativeId === rep.id) && prospect.status !== "visited").length}</span><span>{routes.filter((routeItem) => routeItem.representativeId === rep.id).length}</span></div>)}</Rows>
    </>
  );
}

function Planning({ prospects, routeStops, routes, segments, t }: { prospects: PstProspect[]; routeStops: PstRouteStop[]; routes: PstRoute[]; segments: PstSegment[]; t: TranslationFn }) {
  const planningStops = toMapStopsFromRouteStops(routeStops, prospects, segments, routes);

  return (
    <>
      <Header title={t("pst.planning.title")} />
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex gap-2">{["Dag", "Week", "Maand"].map((label) => <button key={label} className="min-h-9 rounded-md border border-slate-200 px-3 text-sm font-bold">{label}</button>)}</div>
        <div className="mb-4">
          <PstMap stops={planningStops.length ? planningStops : toMapStops(prospects, segments, routes)} t={t} title={t("pst.planning.title")} />
        </div>
        <Rows>
          {routes.map((routeItem) => <p key={routeItem.id} className="py-3 text-sm">{routeItem.date} · {routeItem.name}</p>)}
          {segments.map((segment) => <p key={segment.id} className="py-3 text-sm">{segment.plannedDate} · {segment.description}</p>)}
        </Rows>
      </article>
    </>
  );
}

function Quality({ prospects, routeStops, routes, segments, t }: { prospects: PstProspect[]; routeStops: PstRouteStop[]; routes: PstRoute[]; segments: PstSegment[]; t: TranslationFn }) {
  const checks = [
    [t("pst.quality.segmentsWithoutProspects"), segments.filter((segment) => !prospects.some((prospect) => prospect.segmentId === segment.id)).length],
    [t("pst.quality.routesWithoutStops"), routes.filter((routeItem) => !routeStops.some((stop) => stop.routeId === routeItem.id)).length],
    [t("pst.quality.duplicateProspects"), 0],
    [t("pst.quality.missingAddresses"), prospects.filter((prospect) => !prospect.street || !prospect.city).length]
  ];
  return (
    <>
      <Header title={t("pst.quality.title")} />
      <div className="grid gap-3 md:grid-cols-4">{checks.map(([label, value]) => <article key={label} className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></article>)}</div>
    </>
  );
}

function Header({ action, aside, title }: { action?: string; aside?: string; title: string }) {
  return <div className="flex items-center justify-between"><h2 className="text-2xl font-black">{title}</h2>{action ? <button className="min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white">+ {action}</button> : <p className="text-xs text-slate-600">{aside}</p>}</div>;
}

function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full min-w-[64rem] border-collapse">{children}</table></div>;
}

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white p-4">{children}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-slate-600">{label}</p><p className="mt-2 text-sm font-semibold">{value}</p></div>;
}

function OpenButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="inline-flex min-h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold" onClick={(event) => { event.stopPropagation(); onClick(); }} type="button"><ExternalLink aria-hidden="true" size={13} />{label}</button>;
}

function IconButton({ icon: Icon, label }: { icon: typeof Copy; label: string }) {
  return <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold"><Icon aria-hidden="true" size={16} />{label}</button>;
}

function SegmentStatusBadge({ status, t }: { status: PstSegmentStatus; t: TranslationFn }) {
  const tones: Record<PstSegmentStatus, "blue" | "green" | "amber" | "slate"> = { concept: "slate", ingepland: "blue", lopend: "amber", voorbereiding: "slate", afgewerkt: "green" };
  return <Badge tone={tones[status]}>{t(`pst.segmentStatus.${status}`)}</Badge>;
}

function RouteStatusBadge({ status, t }: { status: PstRouteStatus; t: TranslationFn }) {
  const tones: Record<PstRouteStatus, "blue" | "green" | "amber" | "slate"> = { concept: "blue", ingepland: "slate", lopend: "amber", afgewerkt: "green" };
  return <Badge tone={tones[status]}>{t(`pst.routeStatus.${status}`)}</Badge>;
}

function OpenSegmentStatusBadge({ status }: { status: PstSegmentStatus }) {
  const openStatus = mapOpenSegmentStatus(status);
  const tone = openStatus === "in_bewerking" ? "amber" : "blue";

  return <Badge tone={tone}>{openStatus === "in_bewerking" ? "in bewerking" : "open"}</Badge>;
}

function ProspectStatusBadge({ status, t }: { status: PstProspect["status"]; t: TranslationFn }) {
  const tones: Record<PstProspect["status"], "green" | "blue" | "slate"> = {
    visited: "slate",
    not_visited: "blue",
    planned: "green"
  };

  return <Badge tone={tones[status]}>{t(`pst.prospectStatus.${status}`)}</Badge>;
}

function createRoutePoints(route: PstRoute, stops: PstRouteStop[], prospects: PstProspect[]): RoutePoint[] {
  const routeStops = stops.filter((stop) => stop.routeId === route.id).sort((a, b) => a.sequence - b.sequence);
  const routeProspects: RoutePoint[] = routeStops
    .reduce<RoutePoint[]>((items, stop) => {
      const prospect = prospects.find((item) => item.id === stop.prospectId);
      return prospect ? [...items, { id: stop.id, prospect, sourceStop: stop }] : items;
    }, []);

  if (routeProspects.length > 0) {
    return routeProspects;
  }

  if (!route.segmentId) {
    return [];
  }

  return prospects
    .filter((prospect) => prospect.segmentId === route.segmentId)
    .map((prospect) => ({ id: prospect.id, prospect }));
}

function isOpenSegmentForUser(segment: PstSegment, user: MockUser, completedSegmentIds: string[]) {
  if (!canAccessPst(user) || completedSegmentIds.includes(segment.id) || mapOpenSegmentStatus(segment.status) === "afgewerkt") {
    return false;
  }

  if (canManagePst(user)) {
    return true;
  }

  return segment.representativeId === user.id || segment.representativeName === user.name;
}

function canViewPstSegment(segment: PstSegment, user: MockUser) {
  if (!canAccessPst(user)) {
    return false;
  }

  if (canManagePst(user)) {
    return true;
  }

  return segment.representativeId === user.id || segment.representativeName === user.name;
}

function mapOpenSegmentStatus(status: PstSegmentStatus): "open" | "in_bewerking" | "afgewerkt" {
  if (status === "afgewerkt") {
    return "afgewerkt";
  }

  if (status === "lopend") {
    return "in_bewerking";
  }

  return "open";
}

function toMapStops(prospects: PstProspect[], segments: PstSegment[] = [], routes: PstRoute[] = []): PstMapStop[] {
  return toMapStopsFromOptimized(optimizeRoute(prospects.map((prospect) => ({ id: prospect.id, prospect }))), segments, routes);
}

function toMapStopsFromRouteStops(routeStops: PstRouteStop[], prospects: PstProspect[], segments: PstSegment[] = [], routes: PstRoute[] = []): PstMapStop[] {
  const routePoints: RoutePoint[] = routeStops
    .sort((a, b) => a.sequence - b.sequence)
    .reduce<RoutePoint[]>((items, stop) => {
      const prospect = prospects.find((item) => item.id === stop.prospectId);
      return prospect ? [...items, { id: stop.id, prospect, sourceStop: stop }] : items;
    }, []);

  return toMapStopsFromOptimized(optimizeRoute(routePoints), segments, routes);
}

function toMapStopsFromOptimized(stops: OptimizedRouteStop[], segments: PstSegment[] = [], routes: PstRoute[] = []): PstMapStop[] {
  return stops.map((stop) => {
    const segment = segments.find((item) => item.id === stop.prospect.segmentId);
    const route = routes.find((item) => item.id === stop.sourceStop?.routeId);

    return {
      ...stop,
      representativeName: route?.representativeName ?? segment?.representativeName,
      routeNumber: route?.number,
      segmentName: segment ? `${segment.number} - ${segment.description}` : route?.segmentId
    };
  });
}

function markerColor(status: PstProspect["status"]) {
  if (status === "visited") {
    return "bg-slate-400";
  }

  if (status === "planned") {
    return "bg-emerald-600";
  }

  return "bg-[#003B83]";
}

function address(prospect: PstProspect) {
  return `${prospect.street}, ${prospect.postalCode} ${prospect.city}`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
