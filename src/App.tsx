import { useMemo, useState } from "react";

import type { Category, EventItem, TimeBandKey } from "./types/event";
import { toBandKey } from "./types/event";
import { seedEvents } from "./data/events";
import { CategoryTabs } from "./components/CategoryTabs";
import { DetailModal } from "./components/DetailModal";
import { DevTests } from "./components/DevTests";
import { EventStripe } from "./components/EventStripe";
import { MapView } from "./components/MapView";
import { PlannerView } from "./components/PlannerView";
import { TimeBandTabs, timeBands } from "./components/TimeBandTabs";

// VESPRA – prototipo UI completo (aggiornato)
// - Colori dei titoli: tutti diversi nella stessa pagina (angolo aureo, pastello/primario)
// - Logo VESPRA centrato e più spesso (font-semibold), leggermente "stretcato" in verticale
// - Aggiungi a Google Calendar in dettaglio evento
// - Toggle vista: Lista / Mappa / Planner (timesheet)
// - Badge "V" per offerte PRO con messaggio sconto 20%
// - DevTests: fasce orarie, unicità colori, link Calendar

type EventWithBand = EventItem & { band: TimeBandKey };

export default function App() {
  const [selectedBand, setSelectedBand] = useState<TimeBandKey>("PRIMA");
  const [selectedCat, setSelectedCat] = useState<Category | "ALL">("ALL");
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [view, setView] = useState<"LIST" | "MAP" | "PLANNER">("LIST");

  const events = useMemo(() => {
    return seedEvents
      .map((event) => ({ ...event, band: toBandKey(event.startTime) }))
      .filter((event): event is EventWithBand => event.band !== "OUT");
  }, []);

  const filtered = useMemo(() => {
    return events
      .filter((event) => event.band === selectedBand)
      .filter((event) => (selectedCat === "ALL" ? true : event.category === selectedCat));
  }, [events, selectedBand, selectedCat]);

  const Brand = (
    <div
      className="text-4xl font-semibold tracking-[0.25em] leading-tight"
      style={{ fontFamily: "'Roboto Condensed', 'Helvetica Neue', sans-serif", transform: "scaleY(1.2)" }}
    >
      VESPRA
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-5 pt-6 pb-4 border-b border-white/10 sticky top-0 z-50 bg-black/90 backdrop-blur">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
          <div>
            {Brand}
            <div className="text-white/60 text-sm mt-1 lowercase font-light tracking-wide">stasera? si esce</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`text-xs px-3 py-1.5 rounded border ${
                view === "LIST" ? "bg-white text-black border-white" : "border-white/40 text-white"
              }`}
              onClick={() => setView("LIST")}
            >
              Lista
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded border ${
                view === "MAP" ? "bg-white text-black border-white" : "border-white/40 text-white"
              }`}
              onClick={() => setView("MAP")}
            >
              Mappa
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded border ${
                view === "PLANNER" ? "bg-white text-black border-white" : "border-white/40 text-white"
              }`}
              onClick={() => setView("PLANNER")}
            >
              Planner
            </button>
          </div>
        </div>
      </header>

      <TimeBandTabs selected={selectedBand} onSelect={(band) => setSelectedBand(band)} />
      <CategoryTabs selected={selectedCat} onSelect={(category) => setSelectedCat(category)} />

      <main className="max-w-4xl mx-auto px-5 pb-24">
        {view === "MAP" && <MapView events={filtered} />}
        {view === "PLANNER" && <PlannerView events={filtered} />}
        {view === "LIST" && (
          <section>
            <div className="text-sm text-white/60 mb-2">
              {filtered.length} eventi · {selectedCat === "ALL" ? "Tutte le categorie" : selectedCat} ·{' '}
              {timeBands.find((band) => band.key === selectedBand)?.label}
            </div>
            {filtered.map((event, index) => (
              <EventStripe key={event.id} item={event} index={index} onOpen={(item) => setDetail(item)} />
            ))}
          </section>
        )}

        <DevTests />
      </main>

      {detail && <DetailModal item={detail} onClose={() => setDetail(null)} />}

      <footer className="fixed bottom-0 inset-x-0 bg-black/90 border-t border-white/10 py-2">
        <div className="max-w-4xl mx-auto px-5 flex items-center justify-between text-xs text-white/60">
          <div>Bologna · Beta prototipo UI</div>
          <div>© {new Date().getFullYear()} VESPRA</div>
        </div>
      </footer>
    </div>
  );
}

