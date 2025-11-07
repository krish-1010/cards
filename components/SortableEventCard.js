"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EventCard from "./EventCard";

// Pass the new props through
export default function SortableEventCard({
  event,
  onEdit,
  onInsert,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.week });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Pass them down to the real card */}
      <EventCard
        event={event}
        onEdit={onEdit}
        onInsert={onInsert}
        onDelete={onDelete}
      />
    </div>
  );
}
