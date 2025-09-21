import type { EventItem, TimeBandKey } from "../types/event";
import { pastelColor } from "../utils/colors";

type EventWithBand = EventItem & { band: TimeBandKey };

type PlannerViewProps = {
  events: EventWithBand[];
};

export function PlannerView({ events }: PlannerViewProps) {
  const sorted = [...events].sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-white/60">
          <tr className="border-b border-white/10">
            <th className="text-left py-2 pr-3">Orario</th>
            <th className="text-left py-2 pr-3">Titolo</th>
            <th className="text-left py-2 pr-3">Luogo</th>
            <th className="text-left py-2 pr-3">Categoria</th>
            <th className="text-left py-2 pr-3">Prezzo</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e, i) => {
            const hh = new Date(e.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <tr key={e.id} className="border-b border-white/10">
                <td className="py-2 pr-3 text-white/80">{hh}</td>
                <td className="py-2 pr-3 font-bold uppercase tracking-wider" style={{ color: pastelColor(i) }}>
                  {e.title}
                </td>
                <td className="py-2 pr-3 text-white/70">{e.venueName}</td>
                <td className="py-2 pr-3 text-white/60">{e.category}</td>
                <td className="py-2 pr-3 text-white/60">{e.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

