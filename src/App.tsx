import React, { useMemo, useState } from "react";

// VESPRA – prototipo UI completo (aggiornato)
// - Colori dei titoli: tutti diversi nella stessa pagina (angolo aureo, pastello/primario)
// - Logo VESPRA centrato e più spesso (font-semibold), leggermente "stretcato" in verticale
// - Aggiungi a Google Calendar in dettaglio evento
// - Toggle vista: Lista / Mappa / Planner (timesheet)
// - Badge "V" per offerte PRO con messaggio sconto 20%
// - DevTests: fasce orarie, unicità colori, link Calendar

// ===================== Utility colori =====================
function pastelColor(index: number): string {
  // Genera una sequenza di colori ben distanziati usando l'angolo aureo
  const golden = 137.508; // gradi
  const hue = (index * golden) % 360;
  const sat = 68; // saturazione medio-alta (leggibile su nero)
  const light = 68; // luminosità pastello
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

// ===================== Costanti e tipi =====================
const timeBands = [
  { key: "PRE", label: "PRE-SERATA", range: "18:00 - 21:00" },
  { key: "PRIMA", label: "PRIMA SERATA", range: "21:00 - 23:00" },
  { key: "SECONDA", label: "SECONDA SERATA", range: "23:00 - 01:00" },
] as const;

const categories = ["CINEMA", "TEATRO", "CONCERTI", "CLUBBING"] as const;

type Category = typeof categories[number];

type EventItem = {
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

// ===================== Date helpers =====================
function isoTodayAt(h: number, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function toBandKey(dateIso: string): "PRE" | "PRIMA" | "SECONDA" | "OUT" {
  const d = new Date(dateIso);
  const h = d.getHours();
  if (h >= 18 && h <= 20) return "PRE"; // 18:00–20:59
  if (h >= 21 && h <= 22) return "PRIMA"; // 21:00–22:59
  if (h >= 23 || h === 0) return "SECONDA"; // 23:00–00:59
  return "OUT";
}

// Google Calendar link builder (locale → UTC Z)
function toGoogleDate(dateIso: string) {
  const d = new Date(dateIso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
function gcalLink(e: EventItem) {
  const start = toGoogleDate(e.startTime);
  const endDate = e.endTime ? new Date(e.endTime) : new Date(new Date(e.startTime).getTime() + 2 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    details: `${e.longDescription || e.shortDescription}\nPrezzo: ${e.price}${e.ticketUrl ? `\nBiglietti: ${e.ticketUrl}` : ""}`,
    location: `${e.venueName} – ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ===================== Seed eventi =====================
const seedEvents: EventItem[] = [
  // PRE (18:00–20:59)
  { id: "c_pre_1", title: "CINETECA – DOCUMENTARIO D'AUTORE", category: "CINEMA", shortDescription: "Anteprima con regista in sala.", longDescription: "Sessione Q&A al termine della proiezione. Posti limitati.", venueName: "Cineteca di Bologna", address: "Piazzetta PP Pasolini 2/b", startTime: isoTodayAt(18, 30), price: "7€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1512427691650-83f393f84f2d?q=80&w=1200&auto=format&fit=crop", isVProOffer: true, lat: 44.496, lng: 11.34 },
  { id: "t_pre_1", title: "TEATRO OFF – PERFORMANCE SITE-SPECIFIC", category: "TEATRO", shortDescription: "Spazio industriale riconvertito.", longDescription: "Percorso tra luci e suoni immersivi.", venueName: "Spazio Off", address: "Bolognina", startTime: isoTodayAt(18, 45), price: "Offerta libera", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", lat: 44.512, lng: 11.345 },
  { id: "m_pre_1", title: "ARENA – SOUND CHECK APERTO", category: "CONCERTI", shortDescription: "Meet & greet veloce.", longDescription: "Mini set e firma copie prima del live.", venueName: "Arena del Sole (Foyer)", address: "Via Indipendenza 44", startTime: isoTodayAt(19, 0), price: "Gratis con biglietto", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop", lat: 44.498, lng: 11.342 },
  { id: "cl_pre_1", title: "APERITIVO DJ SET", category: "CLUBBING", shortDescription: "Vinili chill & funk.", longDescription: "Warm-up con selezione in vinile.", venueName: "Cortile Mascarella", address: "Via Mascarella 10", startTime: isoTodayAt(20, 0), price: "Ingresso libero", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200&auto=format&fit=crop", lat: 44.504, lng: 11.348 },

  // PRIMA (21:00–22:59)
  { id: "c_pri_1", title: "CINEMA EUROPA – RASSEGNA NOIR", category: "CINEMA", shortDescription: "Doppia proiezione in 35mm.", longDescription: "Rassegna con introduzione critica.", venueName: "Cinema Europa", address: "Via Pietralata 55", startTime: isoTodayAt(21, 15), price: "8€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963f?q=80&w=1200&auto=format&fit=crop", isVProOffer: true, lat: 44.4989, lng: 11.3417 },
  { id: "c_pri_2", title: "ARENA – FILM ALL'APERTO", category: "CINEMA", shortDescription: "Classico restaurato 4K.", longDescription: "Introduzione della Cineteca.", venueName: "Arena del Sole (cortile)", address: "Via Indipendenza 44", startTime: isoTodayAt(21, 0), price: "10€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop", lat: 44.498, lng: 11.342 },
  { id: "t_pri_1", title: "TEATRO DUSE – AMLETO", category: "TEATRO", shortDescription: "Classico contemporaneo.", longDescription: "Messa in scena essenziale, post-spettacolo con regista.", venueName: "Teatro Duse", address: "Via Cartoleria 42", startTime: isoTodayAt(21, 0), price: "18€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1200&auto=format&fit=crop", lat: 44.4892, lng: 11.3544 },
  { id: "t_pri_2", title: "TEATRO MIC – IMPROVVISAZIONE", category: "TEATRO", shortDescription: "Match d'improvvisazione.", longDescription: "Due squadre, pubblico giudice.", venueName: "Teatro MIC", address: "Bolognina", startTime: isoTodayAt(21, 30), price: "10€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop", isVProOffer: true, lat: 44.51, lng: 11.34 },
  { id: "m_pri_1", title: "LOCALS – CONCERTO INDIE", category: "CONCERTI", shortDescription: "Band emergente + opening.", longDescription: "Merch disponibile a fine live.", venueName: "Locals Club", address: "Via Mascarella 10", startTime: isoTodayAt(21, 30), price: "12€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop", lat: 44.504, lng: 11.348 },
  { id: "m_pri_2", title: "ARENA – JAZZ QUARTET", category: "CONCERTI", shortDescription: "Standard & originali.", longDescription: "Set acustico con ospite al sax.", venueName: "Arena del Sole (Foyer)", address: "Via Indipendenza 44", startTime: isoTodayAt(22, 0), price: "15€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop", lat: 44.498, lng: 11.342 },
  { id: "cl_pri_1", title: "WAREHOUSE – HOUSE CLASSICS", category: "CLUBBING", shortDescription: "Selezione anni '90.", longDescription: "Special guest da Detroit.", venueName: "Warehouse", address: "Zona Fiera", startTime: isoTodayAt(22, 30), price: "18€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200&auto=format&fit=crop", lat: 44.52, lng: 11.35 },

  // SECONDA (23:00–00:59)
  { id: "cl_sec_1", title: "BLAH BLAH – TECHNO NIGHT", category: "CLUBBING", shortDescription: "Guest DJ europeo.", longDescription: "Line-up completa su IG.", venueName: "Blah Blah Club", address: "Via Mascarella 10", startTime: isoTodayAt(23, 30), price: "15€ (drink)", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop", lat: 44.504, lng: 11.348 },
  { id: "cl_sec_2", title: "RIVER – LATIN NIGHT", category: "CLUBBING", shortDescription: "Salsa & Bachata.", longDescription: "Lezioni 23:00, party a seguire.", venueName: "River Club", address: "Reno", startTime: isoTodayAt(23, 0), price: "12€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1514533450685-444d6b8b4b0c?q=80&w=1200&auto=format&fit=crop", isVProOffer: true, lat: 44.49, lng: 11.32 },
  { id: "m_sec_1", title: "ELECTRO LIVE – LATE SET", category: "CONCERTI", shortDescription: "Set modulare.", longDescription: "Visual a cura di VJ ospite.", venueName: "XYZ Club", address: "Via Zamboni", startTime: isoTodayAt(23, 15), price: "14€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop", lat: 44.50, lng: 11.34 },
  { id: "c_sec_1", title: "MIDNIGHT MOVIE – HORROR", category: "CINEMA", shortDescription: "Proiezione di mezzanotte.", longDescription: "Cult anni '80 in pellicola.", venueName: "Cinema Moderno", address: "Centro", startTime: isoTodayAt(23, 55), price: "9€", ticketUrl: "#", imageUrl: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop", lat: 44.49, lng: 11.34 },
];

// ===================== UI: Tabs fasce orarie e categorie =====================
function TimeBandTabs({ selected, onSelect }: { selected: string; onSelect: (k: string) => void }) {
  return (
    <div className="w-full flex gap-2 justify-center items-center sticky top-0 z-40 bg-black/90 backdrop-blur px-4 py-2 border-b border-white/10">
      {timeBands.map((b) => {
        const active = selected === b.key;
        const baseBtn = "flex flex-col items-center px-3 py-2 rounded-full text-xs tracking-widest border";
        const palette = active
          ? "bg-white text-black border-white"
          : "text-white border-white/30 hover:border-white";
        const rangeClass = active ? "text-[10px] mt-0.5" : "text-[10px] text-white/70 mt-0.5";
        return (
          <button key={b.key} onClick={() => onSelect(b.key)} className={`${baseBtn} ${palette}`} aria-pressed={active}>
            <span>{b.label}</span>
            <span className={rangeClass}>{b.range}</span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryTabs({ selected, onSelect }: { selected: Category | "ALL"; onSelect: (c: Category | "ALL") => void }) {
  const cats: (Category | "ALL")[] = ["ALL", ...categories];
  return (
    <div className="w-full flex flex-wrap gap-2 justify-center items-center sticky top-[64px] z-30 bg-black/90 backdrop-blur px-4 border-b border-white/10">
      {cats.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`px-3 py-1.5 rounded-full text-xs border ${
            selected === c ? "bg-white text-black border-white" : "text-white border-white/30 hover:border-white"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ===================== Striscia evento =====================
function EventStripe({ item, index, onOpen }: { item: EventItem; index: number; onOpen: (e: EventItem) => void }) {
  const color = pastelColor(index); // unico per indice nella pagina
  const hh = new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [showV, setShowV] = useState(false);
  return (
    <div className="w-full border-b border-white/10 py-3 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => onOpen(item)}>
          <div className="font-bold uppercase tracking-wider" style={{ color }}>{item.title}</div>
          <div className="text-white/90 text-sm mt-0.5">{item.shortDescription}</div>
          <div className="text-white/60 text-xs mt-0.5">{item.venueName} · {hh} · {item.price}</div>
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
                  <div className="text-white/80">Acquista a prezzo scontato del <b>20%</b>, solo per <b>SOCI VESPRA PRO</b>.</div>
                </div>
              )}
            </div>
          )}
          <button
            className="text-xs px-2 py-1 rounded border border-white/40 text-white hover:border-white"
            onClick={() => onOpen(item)}
          >
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== Modal dettaglio =====================
function DetailModal({ item, onClose }: { item: EventItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-black border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
        <div className="p-5">
          <div className="text-2xl font-bold uppercase tracking-wider" style={{ color: pastelColor(0) }}>{item.title}</div>
          <div className="mt-2 text-white/90">{item.longDescription}</div>
          <div className="mt-3 text-white/70 text-sm">
            <div><span className="text-white/50">Luogo:</span> {item.venueName} – {item.address}</div>
            <div><span className="text-white/50">Orario:</span> {new Date(item.startTime).toLocaleString()}</div>
            <div><span className="text-white/50">Prezzo:</span> {item.price}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.ticketUrl && (
              <a href={item.ticketUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded border border-white text-white hover:bg-white hover:text-black text-sm">
                Apri sito / Acquista
              </a>
            )}
            <a href={gcalLink(item)} target="_blank" rel="noreferrer" className="px-3 py-2 rounded border border-white/60 text-white hover:border-white text-sm">
              Aggiungi a Google Calendar
            </a>
            <button onClick={onClose} className="px-3 py-2 rounded border border-white/40 text-white hover:border-white text-sm">Chiudi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== Vista mappa (semplice) =====================
function MapView({ events }: { events: (EventItem & { band: string })[] }) {
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
            <span className="font-semibold" style={{ color: pastelColor(i) }}>{e.title}</span>
            <span className="text-white/50">— {e.venueName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===================== Vista planner (timesheet) =====================
function PlannerView({ events }: { events: (EventItem & { band: string })[] }) {
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
                <td className="py-2 pr-3 font-bold uppercase tracking-wider" style={{ color: pastelColor(i) }}>{e.title}</td>
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

// ===================== Dev tests =====================
function DevTests() {
  type Expect = "PRE" | "PRIMA" | "SECONDA" | "OUT";
  const isoAt = (h: number, m = 0) => isoTodayAt(h, m);
  const bandCases: { name: string; iso: string; expected: Expect }[] = [
    { name: "18:00 in PRE", iso: isoAt(18, 0), expected: "PRE" },
    { name: "20:59 in PRE", iso: isoAt(20, 59), expected: "PRE" },
    { name: "21:00 in PRIMA", iso: isoAt(21, 0), expected: "PRIMA" },
    { name: "22:59 in PRIMA", iso: isoAt(22, 59), expected: "PRIMA" },
    { name: "23:00 in SECONDA", iso: isoAt(23, 0), expected: "SECONDA" },
    { name: "00:30 in SECONDA", iso: isoAt(0, 30), expected: "SECONDA" },
    { name: "01:00 fuori fascia?", iso: isoAt(1, 0), expected: "OUT" }, // CHIARIRE: includere 01:00?
    { name: "17:59 fuori fascia", iso: isoAt(17, 59), expected: "OUT" },
  ];

  // Test unicità colori per i primi N eventi
  const N = 12;
  const colors = Array.from({ length: N }, (_, i) => pastelColor(i));
  const unique = new Set(colors).size;

  // Test link Google Calendar semplice
  const sample: EventItem = {
    id: "test",
    title: "TEST EVENT",
    category: "CINEMA",
    shortDescription: "short",
    longDescription: "long",
    venueName: "Place",
    address: "Address",
    startTime: isoTodayAt(21, 0),
    price: "0€",
  };
  const linkOk = gcalLink(sample).includes("calendar.google.com/calendar/render?action=TEMPLATE");

  const bandResults = bandCases.map((c) => ({ ...c, actual: toBandKey(c.iso), pass: toBandKey(c.iso) === c.expected }));
  const bandPassed = bandResults.filter((r) => r.pass).length;

  return (
    <div className="mt-8 text-xs text-white/60">
      <details>
        <summary>Dev tests: fasce {bandPassed}/{bandResults.length} · colori unici {unique}/{N} · gcal {linkOk ? "ok" : "fail"}</summary>
        <ul className="mt-2 list-disc pl-5">
          {bandResults.map((r, i) => (
            <li key={i} className={r.pass ? "text-white/70" : "text-red-400"}>
              {r.name} → atteso <b>{r.expected}</b>, ottenuto <b>{r.actual}</b>
            </li>
          ))}
          <li className="mt-2">Colori generati: {colors.join(", ")}</li>
          <li>Google Calendar link: {linkOk ? "OK" : "FAIL"}</li>
        </ul>
      </details>
    </div>
  );
}

// ===================== App =====================
export default function App() {
  const [selectedBand, setSelectedBand] = useState<"PRE" | "PRIMA" | "SECONDA">("PRIMA");
  const [selectedCat, setSelectedCat] = useState<Category | "ALL">("ALL");
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [view, setView] = useState<"LIST" | "MAP" | "PLANNER">("LIST");

  const events = useMemo(() => seedEvents.map((e) => ({ ...e, band: toBandKey(e.startTime) } as EventItem & { band: string })), []);

  const filtered = useMemo(() => {
    return events
      .filter((e) => e.band === selectedBand)
      .filter((e) => (selectedCat === "ALL" ? true : e.category === selectedCat));
  }, [events, selectedBand, selectedCat]);

  // Header brand
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
      {/* Header centrato */}
      <header className="px-5 pt-6 pb-4 border-b border-white/10 sticky top-0 z-50 bg-black/90 backdrop-blur">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
          <div>
            {Brand}
            <div className="text-white/60 text-sm mt-1 lowercase font-light tracking-wide">stasera? si esce</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`text-xs px-3 py-1.5 rounded border ${view === "LIST" ? "bg-white text-black border-white" : "border-white/40 text-white"}`}
              onClick={() => setView("LIST")}
            >
              Lista
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded border ${view === "MAP" ? "bg-white text-black border-white" : "border-white/40 text-white"}`}
              onClick={() => setView("MAP")}
            >
              Mappa
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded border ${view === "PLANNER" ? "bg-white text-black border-white" : "border-white/40 text-white"}`}
              onClick={() => setView("PLANNER")}
            >
              Planner
            </button>
          </div>
        </div>
      </header>

      <TimeBandTabs selected={selectedBand} onSelect={(k) => setSelectedBand(k as any)} />
      <CategoryTabs selected={selectedCat} onSelect={setSelectedCat} />

      <main className="max-w-4xl mx-auto px-5 pb-24">
        {view === "MAP" && <MapView events={filtered} />}
        {view === "PLANNER" && <PlannerView events={filtered} />}
        {view === "LIST" && (
          <section>
            <div className="text-sm text-white/60 mb-2">
              {filtered.length} eventi · {selectedCat === "ALL" ? "Tutte le categorie" : selectedCat} · {timeBands.find(t => t.key === selectedBand)?.label}
            </div>
            {filtered.map((e, i) => (
              <EventStripe key={e.id} item={e} index={i} onOpen={setDetail} />)
            )}
          </section>
        )}

        {/* Dev tests visuali */}
        <DevTests />
      </main>

      {detail && <DetailModal item={detail} onClose={() => setDetail(null)} />}

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 bg-black/90 border-t border-white/10 py-2">
        <div className="max-w-4xl mx-auto px-5 flex items-center justify-between text-xs text-white/60">
          <div>Bologna · Beta prototipo UI</div>
          <div>© {new Date().getFullYear()} VESPRA</div>
        </div>
      </footer>
    </div>
  );
}
