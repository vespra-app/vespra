export const categories = ["CINEMA", "TEATRO", "CONCERTI", "CLUBBING"] as const;

export type Category = (typeof categories)[number];

export type TimeBandKey = "PRE" | "PRIMA" | "SECONDA";

export type EventItem = {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  longDescription: string;
  venueName: string;
  address: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  price: string;
  ticketUrl?: string;
  imageUrl?: string;
  isSpecialOffer?: boolean;
  isVProOffer?: boolean; // badge V
  lat?: number;
  lng?: number;
};

export function toBandKey(dateIso: string): TimeBandKey | "OUT" {
  const d = new Date(dateIso);
  const h = d.getHours();
  if (h >= 18 && h <= 20) return "PRE"; // 18:00–20:59
  if (h >= 21 && h <= 22) return "PRIMA"; // 21:00–22:59
  if (h >= 23 || h === 0) return "SECONDA"; // 23:00–00:59
  return "OUT";
}

function toGoogleDate(dateIso: string): string {
  const d = new Date(dateIso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function gcalLink(e: EventItem): string {
  const start = toGoogleDate(e.startTime);
  const endDate = e.endTime
    ? new Date(e.endTime)
    : new Date(new Date(e.startTime).getTime() + 2 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    details: `${e.longDescription || e.shortDescription}\nPrezzo: ${e.price}${
      e.ticketUrl ? `\nBiglietti: ${e.ticketUrl}` : ""
    }`,
    location: `${e.venueName} – ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

