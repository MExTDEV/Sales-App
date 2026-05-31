import type { Campaign, ScheduleItem } from "./types";

export function campaignsDueToday(campaigns: Campaign[], today = new Date()): Campaign[] {
  const day = today.getDay();

  if (day === 0 || day === 6) {
    return [];
  }

  return campaigns.filter((campaign) => campaign.status === "scheduled");
}

export function buildAnnualSchedule(items: ScheduleItem[]) {
  return items.map((item, index) => ({
    ...item,
    slot: index + 1,
    locked: item.status === "complete" || item.status === "active"
  }));
}
