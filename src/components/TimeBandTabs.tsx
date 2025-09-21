import type { TimeBandKey } from "../types/event";

export const timeBands = [
  { key: "PRE", label: "PRE-SERATA", range: "18:00 - 21:00" },
  { key: "PRIMA", label: "PRIMA SERATA", range: "21:00 - 23:00" },
  { key: "SECONDA", label: "SECONDA SERATA", range: "23:00 - 01:00" },
] as const;

type TimeBandTabsProps = {
  selected: TimeBandKey;
  onSelect: (key: TimeBandKey) => void;
};

export function TimeBandTabs({ selected, onSelect }: TimeBandTabsProps) {
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

