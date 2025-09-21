import type { Category } from "../types/event";
import { categories } from "../types/event";

type CategoryTabsProps = {
  selected: Category | "ALL";
  onSelect: (category: Category | "ALL") => void;
};

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
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

