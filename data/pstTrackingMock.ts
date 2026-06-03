import type { PstProspect, PstRepresentative, PstRoute, PstRouteStop, PstSegment, PstVisit } from "@/types/sales";

export const pstRepresentatives: PstRepresentative[] = [
  { id: "rep-jochen", name: "Jochen Andries", region: "Bayern" },
  { id: "rep-sofie", name: "Sofie Jacobs", region: "Berlin" },
  { id: "rep-tom", name: "Tom Verbruggen", region: "Hamburg" }
];

export const pstSegments: PstSegment[] = [
  {
    id: "seg-muc-001",
    number: "DE-MUC-001",
    description: "Segment Munchen Zentrum",
    sectorCode: "GAS-01",
    sectorName: "Gastronomie",
    region: "Bayern",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    plannedDate: "2026-05-30",
    status: "lopend",
    notes: "Focus op horeca rond Marienplatz.",
    boundaryGeoJson: {
      type: "Polygon",
      coordinates: [[
        [11.5638, 48.1321],
        [11.5766, 48.1266],
        [11.5921, 48.1337],
        [11.5865, 48.1491],
        [11.5691, 48.1508],
        [11.5638, 48.1321]
      ]]
    },
    createdAt: "2026-05-30T14:45:44.000Z",
    updatedAt: "2026-05-30T14:45:44.000Z"
  },
  {
    id: "seg-ber-014",
    number: "DE-BER-014",
    description: "Segment Berlin Mitte",
    sectorCode: "RET-02",
    sectorName: "Retail",
    region: "Berlin",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    plannedDate: "2026-06-01",
    status: "voorbereiding",
    notes: "Retailprospectie rond Mitte.",
    boundaryGeoJson: {
      type: "Polygon",
      coordinates: [[
        [13.373, 52.513],
        [13.397, 52.507],
        [13.424, 52.516],
        [13.417, 52.535],
        [13.384, 52.535],
        [13.373, 52.513]
      ]]
    },
    createdAt: "2026-05-28T09:15:00.000Z",
    updatedAt: "2026-05-29T11:30:00.000Z"
  },
  {
    id: "seg-ham-007",
    number: "DE-HAM-007",
    description: "Segment Hamburg HafenCity",
    sectorCode: "IND-03",
    sectorName: "Industrie",
    region: "Hamburg",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    plannedDate: "2026-06-04",
    status: "voorbereiding",
    notes: "Nieuwe route in voorbereiding.",
    boundaryGeoJson: {
      type: "Polygon",
      coordinates: [[
        [9.981, 53.535],
        [10.011, 53.535],
        [10.023, 53.553],
        [10.005, 53.565],
        [9.974, 53.556],
        [9.981, 53.535]
      ]]
    },
    createdAt: "2026-05-27T08:20:00.000Z",
    updatedAt: "2026-05-30T10:10:00.000Z"
  },
  {
    id: "seg-cgn-022",
    number: "DE-CGN-022",
    description: "Segment Koln Innenstadt",
    sectorCode: "HOR-04",
    sectorName: "Horeca",
    region: "Nordrhein-Westfalen",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    plannedDate: "2026-05-23",
    status: "afgewerkt",
    notes: "Segment afgerond.",
    boundaryGeoJson: {
      type: "Polygon",
      coordinates: [[
        [6.943, 50.930],
        [6.965, 50.927],
        [6.976, 50.941],
        [6.961, 50.956],
        [6.938, 50.949],
        [6.943, 50.930]
      ]]
    },
    createdAt: "2026-05-18T08:00:00.000Z",
    updatedAt: "2026-05-23T17:00:00.000Z"
  }
];

export const pstProspects: PstProspect[] = [
  { id: "pros-001", segmentId: "seg-muc-001", name: "Apotheke St. Anna", street: "Sendlinger Str. 9", postalCode: "80331", city: "Munchen", country: "DE", status: "visited", lastVisitedAt: "2026-05-28T14:45:44.000Z", assignedRepresentativeId: "rep-jochen", latitude: 48.1353, longitude: 11.5727 },
  { id: "pros-002", segmentId: "seg-muc-001", name: "Backerei Hoffmann GmbH", street: "Leopoldstrasse 45", postalCode: "80802", city: "Munchen", country: "DE", status: "visited", lastVisitedAt: "2026-05-29T14:45:44.000Z", assignedRepresentativeId: "rep-jochen", latitude: 48.1591, longitude: 11.5866 },
  { id: "pros-003", segmentId: "seg-muc-001", name: "Hotel Bayerischer Hof", street: "Promenadeplatz 2-6", postalCode: "80333", city: "Munchen", country: "DE", status: "not_visited", assignedRepresentativeId: "rep-jochen", latitude: 48.1402, longitude: 11.5736 },
  { id: "pros-004", segmentId: "seg-muc-001", name: "Brauerei Hacker-Pschorr", street: "Hochstrasse 75", postalCode: "81541", city: "Munchen", country: "DE", status: "planned", assignedRepresentativeId: "rep-jochen", latitude: 48.1244, longitude: 11.5897 },
  { id: "pros-007", segmentId: "seg-muc-001", name: "Cafe Marienplatz", street: "Marienplatz 8", postalCode: "80331", city: "Munchen", country: "DE", status: "not_visited", assignedRepresentativeId: "rep-jochen", latitude: 48.1374, longitude: 11.5755 },
  { id: "pros-008", segmentId: "seg-muc-001", name: "Restaurant Isartor", street: "Tal 43", postalCode: "80331", city: "Munchen", country: "DE", status: "planned", assignedRepresentativeId: "rep-jochen", latitude: 48.1358, longitude: 11.5824 },
  { id: "pros-005", segmentId: "seg-ber-014", name: "Cafe am Kurfurstendamm", street: "Kurfurstendamm 18", postalCode: "10719", city: "Berlin", country: "DE", status: "visited", lastVisitedAt: "2026-05-27T14:45:44.000Z", assignedRepresentativeId: "rep-jochen", latitude: 52.503, longitude: 13.327 },
  { id: "pros-006", segmentId: "seg-cgn-022", name: "Logistik Nord GmbH & Co. KG", street: "Industriestrasse 12", postalCode: "50667", city: "Koln", country: "DE", status: "visited", lastVisitedAt: "2026-05-25T14:45:44.000Z", assignedRepresentativeId: "rep-jochen", latitude: 50.941, longitude: 6.958 }
];

export const pstRoutes: PstRoute[] = [
  {
    id: "route-ham-003",
    number: "R-2026-003",
    name: "Route Munchen centrum",
    segmentId: "seg-muc-001",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    date: "2026-06-02",
    status: "concept",
    startLocation: {
      label: "M.Ex.T. startpunt Munchen",
      latitude: 48.1372,
      longitude: 11.5756
    },
    calculatedAt: "2026-05-30T17:55:00.000Z"
  },
  {
    id: "route-ber-002",
    number: "R-2026-002",
    name: "Route Berlin Mitte",
    segmentId: "seg-ber-014",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    date: "2026-05-31",
    status: "ingepland",
    startAddress: "Alexanderplatz, Berlin",
    endAddress: "Friedrichstrasse, Berlin"
  },
  {
    id: "route-muc-001",
    number: "R-2026-001",
    name: "Route Munchen ochtend",
    segmentId: "seg-muc-001",
    representativeId: "rep-jochen",
    representativeName: "Jochen Andries",
    date: "2026-05-30",
    status: "lopend",
    startAddress: "Marienplatz, Munchen",
    endAddress: "Hochstrasse 75, Munchen"
  }
];

export const pstRouteStops: PstRouteStop[] = [
  { id: "stop-001", routeId: "route-ham-003", prospectId: "pros-002", sequence: 1, latitude: 48.1591, longitude: 11.5866 },
  { id: "stop-002", routeId: "route-ham-003", prospectId: "pros-001", sequence: 2, latitude: 48.1353, longitude: 11.5727 },
  { id: "stop-003", routeId: "route-ham-003", prospectId: "pros-003", sequence: 3, latitude: 48.1402, longitude: 11.5736 },
  { id: "stop-004", routeId: "route-ham-003", prospectId: "pros-004", sequence: 4, latitude: 48.1244, longitude: 11.5897 },
  { id: "stop-007", routeId: "route-ham-003", prospectId: "pros-007", sequence: 5, latitude: 48.1374, longitude: 11.5755 },
  { id: "stop-008", routeId: "route-ham-003", prospectId: "pros-008", sequence: 6, latitude: 48.1358, longitude: 11.5824 },
  { id: "stop-005", routeId: "route-muc-001", prospectId: "pros-001", sequence: 1, latitude: 48.1353, longitude: 11.5727 },
  { id: "stop-006", routeId: "route-muc-001", prospectId: "pros-002", sequence: 2, latitude: 48.1591, longitude: 11.5866 }
];

export const pstVisits: PstVisit[] = [
  { id: "visit-001", prospectId: "pros-002", prospectName: "Backerei Hoffmann GmbH", representativeName: "Jochen Andries", status: "visited", visitedAt: "2026-05-29T14:45:44.000Z" },
  { id: "visit-002", prospectId: "pros-001", prospectName: "Apotheke St. Anna", representativeName: "Jochen Andries", status: "visited", visitedAt: "2026-05-28T14:45:44.000Z" },
  { id: "visit-003", prospectId: "pros-005", prospectName: "Cafe am Kurfurstendamm", representativeName: "Jochen Andries", status: "visited", visitedAt: "2026-05-27T14:45:44.000Z" },
  { id: "visit-004", prospectId: "pros-006", prospectName: "Logistik Nord GmbH & Co. KG", representativeName: "Jochen Andries", status: "visited", visitedAt: "2026-05-25T14:45:44.000Z" },
  { id: "visit-005", prospectId: "pros-004", prospectName: "Brauhaus Sunner", representativeName: "Jochen Andries", status: "visited", visitedAt: "2026-05-20T14:45:44.000Z" }
];
