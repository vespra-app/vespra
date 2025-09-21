import { useState } from "react";

import type { EventItem } from "../types/event";
import { pastelColor } from "../utils/colors";

type EventStripeProps = {
  item: EventItem;
  index: number;
  onOpen: (item: EventItem) => void;
};

export function EventStripe({ item, index, onOpen }: EventStripeProps) {
  const color = pastelColor(index);
  const hh = new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [showV, setShowV] = useState(false);
  return (
    <div className="w-full border-b border-white/10 py-3 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => onOpen(item)}>
          <div className="font-bold uppercase tracking-wider" style={{ color }}>
            {item.title}
          </div>
          <div className="text-white/90 text-sm mt-0.5">{item.shortDescription}</div>
          <div className="text-white/60 text-xs mt-0.5">
            {item.venueName} · {hh} · {item.price}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {item.isVProOffer && (
            <div className="relative">
              <button
                aria-label="VESPRA PRO"
                onClick={() => setShowV((v) => !v)}
                className="w-6 h-6 rounded-full border border-pink-400/70 text-pink-300 text-xs flex items-center justify-center hover:bg-pink-400/10"
                title="Offerta VESPRA PRO"
              >
                V
              </button>
              {showV && (
                <div className="absolute right-0 mt-1 w-64 text-xs bg-black border border-white/20 rounded-lg p-2 shadow-xl">
                  <div className="font-semibold text-pink-300 mb-1">Offerta VESPRA PRO</div>
                  <div className="text-white/80">
                    Acquista a prezzo scontato del <b>20%</b>, solo per <b>SOCI VESPRA PRO</b>.
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="text-xs px-2 py-1 rounded border border-white/40 text-white hover:border-white" onClick={() => onOpen(item)}>
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
}

