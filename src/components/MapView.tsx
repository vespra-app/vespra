import type { EventItem, TimeBandKey } from "../types/event";
import { pastelColor } from "../utils/colors";

type EventWithBand = EventItem & { band: TimeBandKey };

type MapViewProps = {
  events: EventWithBand[];
};

export function MapView({ events }: MapViewProps) {
  return (
    <div className="space-y-3">
      <div className="h-64 w-full border border-white/10 rounded-xl overflow-hidden">
        <iframe
          title="Mappa Bologna"
          className="w-full h-full"
          src="https://www.openstreetmap.org/export/embed.html?bbox=11.300%2C44.460%2C11.380%2C44.520&layer=mapnik&marker=44.4949%2C11.3426"
        />
      </div>
      <div className="text-white/70 text-sm">Punti evento (elenco):</div>
      <ul className="text-sm text-white/80 space-y-1">
        {events.map((e, i) => (
          <li key={e.id} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: pastelColor(i) }} />
            <span className="font-semibold" style={{ color: pastelColor(i) }}>
              {e.title}
            </span>
            <span className="text-white/50">— {e.venueName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

