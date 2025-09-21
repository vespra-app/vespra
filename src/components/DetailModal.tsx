import type { EventItem } from "../types/event";
import { gcalLink } from "../types/event";
import { pastelColor } from "../utils/colors";

type DetailModalProps = {
  item: EventItem;
  onClose: () => void;
};

export function DetailModal({ item, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-black border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
        <div className="p-5">
          <div className="text-2xl font-bold uppercase tracking-wider" style={{ color: pastelColor(0) }}>
            {item.title}
          </div>
          <div className="mt-2 text-white/90">{item.longDescription}</div>
          <div className="mt-3 text-white/70 text-sm">
            <div>
              <span className="text-white/50">Luogo:</span> {item.venueName} – {item.address}
            </div>
            <div>
              <span className="text-white/50">Orario:</span> {new Date(item.startTime).toLocaleString()}
            </div>
            <div>
              <span className="text-white/50">Prezzo:</span> {item.price}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.ticketUrl && (
              <a
                href={item.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded border border-white text-white hover:bg-white hover:text-black text-sm"
              >
                Apri sito / Acquista
              </a>
            )}
            <a
              href={gcalLink(item)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded border border-white/60 text-white hover:border-white text-sm"
            >
              Aggiungi a Google Calendar
            </a>
            <button onClick={onClose} className="px-3 py-2 rounded border border-white/40 text-white hover:border-white text-sm">
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

