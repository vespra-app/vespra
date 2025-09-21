import type { EventItem, TimeBandKey } from "../types/event";
import { gcalLink, toBandKey } from "../types/event";
import { isoTodayAt } from "../utils/datetime";
import { pastelColor } from "../utils/colors";

type Expect = TimeBandKey | "OUT";

export function DevTests() {
  const isoAt = (h: number, m = 0) => isoTodayAt(h, m);
  const bandCases: { name: string; iso: string; expected: Expect }[] = [
    { name: "18:00 in PRE", iso: isoAt(18, 0), expected: "PRE" },
    { name: "20:59 in PRE", iso: isoAt(20, 59), expected: "PRE" },
    { name: "21:00 in PRIMA", iso: isoAt(21, 0), expected: "PRIMA" },
    { name: "22:59 in PRIMA", iso: isoAt(22, 59), expected: "PRIMA" },
    { name: "23:00 in SECONDA", iso: isoAt(23, 0), expected: "SECONDA" },
    { name: "00:30 in SECONDA", iso: isoAt(0, 30), expected: "SECONDA" },
    { name: "01:00 fuori fascia?", iso: isoAt(1, 0), expected: "OUT" },
    { name: "17:59 fuori fascia", iso: isoAt(17, 59), expected: "OUT" },
  ];

  const N = 12;
  const colors = Array.from({ length: N }, (_, i) => pastelColor(i));
  const unique = new Set(colors).size;

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
        <summary>
          Dev tests: fasce {bandPassed}/{bandResults.length} · colori unici {unique}/{N} · gcal {linkOk ? "ok" : "fail"}
        </summary>
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

