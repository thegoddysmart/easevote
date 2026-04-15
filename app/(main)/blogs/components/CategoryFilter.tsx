"use client";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  active,
  onChange,
}: CategoryFilterProps) => (
  <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
          active === cat
            ? "bg-slate-900 text-white shadow-lg"
            : "bg-white text-slate-600 border border-gray-200 hover:border-magenta-500 hover:text-magenta-600"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);
