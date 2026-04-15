import SearchBar from "../../ui/SearchBar";

interface Props {
  filters: string[];
  active: string;
  onFilterChange: (f: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export default function EventFilters({
  filters,
  active,
  onFilterChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
      <SearchBar value={search} onChange={onSearchChange} />

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              active === f
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
