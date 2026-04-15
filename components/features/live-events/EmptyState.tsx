import { Search } from "lucide-react";

export default function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="text-gray-300" size={32} />
      </div>

      <p className="text-slate-500 text-lg font-medium">
        No events found matching &quot;{query}&quot;
      </p>

      <button
        onClick={onClear}
        className="mt-6 text-magenta-600 font-bold hover:underline"
      >
        Clear Search
      </button>
    </div>
  );
}
