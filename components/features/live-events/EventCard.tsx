import Link from "next/link";

export default function EventCard({ event }: { event: any }) {
  return (
    <div className="snap-center shrink-0 w-[85vw] md:w-auto group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            event.imageUrl ||
            event.coverImage ||
            event.image ||
            "https://images.unsplash.com/photo-1540039155733-d730a53bf30c?q=80&w=2667&auto=format&fit=crop"
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
            event.status === "Live" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {event.status}
        </span>

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-6 relative">
        <p className="text-xs font-bold text-brand-bright uppercase mb-2">
          {event.categories && event.categories.length > 0
            ? event.categories[0].name
            : event.type || event.category}
        </p>

        <h3 className="text-xl font-bold text-brand-deep mb-1">
          {event.title}
        </h3>

        <p className="text-sm text-brand-bright mb-6">
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : event.date}
        </p>

        <Link
          href={`/events/${event.eventCode}`}
          className="block w-full text-center py-3 rounded-xl bg-slate-50 font-bold hover:bg-brand-bright hover:text-white! transition"
        >
          Vote Now
        </Link>
      </div>
    </div>
  );
}
