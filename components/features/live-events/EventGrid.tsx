import { Event } from "@/types";
import EventCard from "./EventCard";
import EmptyState from "./EmptyState";

interface Props {
  events: Event[];
  searchQuery: string;
  onClear: () => void;
}

export default function EventGrid({ events, searchQuery, onClear }: Props) {
  if (!events.length) {
    return <EmptyState query={searchQuery} onClear={onClear} />;
  }

  return (
    <div className="flex overflow-x-auto snap-x gap-6 pb-8 md:grid md:grid-cols-4 md:gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
