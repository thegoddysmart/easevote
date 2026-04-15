export default function EventLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero banner */}
      <div className="h-72 bg-slate-200 w-full" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Event title + meta */}
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-5 bg-slate-100 rounded w-1/2" />
          <div className="flex gap-3">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-28 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-slate-200 rounded-full" />
          ))}
        </div>

        {/* Candidate cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="aspect-square bg-slate-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
