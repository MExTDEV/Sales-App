import type { PstProspect, PstRouteStop } from "@/types/sales";

export type RoutePoint = {
  id: string;
  prospect: PstProspect;
  sourceStop?: PstRouteStop;
};

export type OptimizedRouteStop = RoutePoint & {
  sequence: number;
  calculatedDistanceFromPreviousKm: number;
  calculatedTravelTimeFromPreviousMin: number;
};

export type RouteLocation = {
  label?: string;
  latitude: number;
  longitude: number;
};

const averageUrbanSpeedKmPerHour = 28;

export function optimizeRoute(stops: RoutePoint[], startLocation?: RouteLocation): OptimizedRouteStop[] {
  if (stops.length === 0) {
    return [];
  }

  const remaining = [...stops];
  const ordered: OptimizedRouteStop[] = [];
  let currentLocation = startLocation ?? remaining[0].prospect;

  while (remaining.length > 0) {
    const nearestIndex = findNearestIndex(currentLocation, remaining);
    const [next] = remaining.splice(nearestIndex, 1);
    const distance = calculateDistanceKm(currentLocation, next.prospect);

    ordered.push({
      ...next,
      sequence: ordered.length + 1,
      calculatedDistanceFromPreviousKm: ordered.length === 0 && !startLocation ? 0 : roundDistance(distance),
      calculatedTravelTimeFromPreviousMin: ordered.length === 0 && !startLocation ? 0 : estimateLegTravelTime(distance)
    });

    currentLocation = next.prospect;
  }

  return ordered;
}

export function calculateTotalDistance(orderedStops: Array<Pick<OptimizedRouteStop, "calculatedDistanceFromPreviousKm">>) {
  return roundDistance(orderedStops.reduce((total, stop) => total + stop.calculatedDistanceFromPreviousKm, 0));
}

export function estimateTravelTime(totalDistanceKm: number) {
  return Math.max(0, Math.round((totalDistanceKm / averageUrbanSpeedKmPerHour) * 60));
}

export function getRouteBounds(orderedStops: Array<{ prospect: Pick<PstProspect, "latitude" | "longitude"> }>) {
  if (orderedStops.length === 0) {
    return undefined;
  }

  const latitudes = orderedStops.map((stop) => stop.prospect.latitude);
  const longitudes = orderedStops.map((stop) => stop.prospect.longitude);

  return {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes)
  };
}

export function calculateDistanceKm(from: RouteLocation, to: RouteLocation) {
  const earthRadiusKm = 6371;
  const latitudeDistance = toRadians(to.latitude - from.latitude);
  const longitudeDistance = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDistance / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function findNearestIndex(from: RouteLocation, stops: RoutePoint[]) {
  return stops.reduce(
    (nearest, stop, index) => {
      const distance = calculateDistanceKm(from, stop.prospect);
      return distance < nearest.distance ? { distance, index } : nearest;
    },
    { distance: Number.POSITIVE_INFINITY, index: 0 }
  ).index;
}

function estimateLegTravelTime(distanceKm: number) {
  return Math.max(1, Math.round((distanceKm / averageUrbanSpeedKmPerHour) * 60));
}

function roundDistance(value: number) {
  return Math.round(value * 10) / 10;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
