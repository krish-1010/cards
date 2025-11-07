"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper style for table
const tableCellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
};

// This component renders a <TR>
export default function SortableEventRow({
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
    <tr ref={setNodeRef} style={style} {...attributes}>
      {/* This is the "grab handle" for the row. 
        We put the listener on a single cell.
      */}
      <td style={{ ...tableCellStyle, cursor: "grab" }} {...listeners}>
        {event.week}
      </td>
      <td style={tableCellStyle}>{event.title}</td>
      <td style={tableCellStyle}>{event.start_date}</td>
      <td style={tableCellStyle}>{event.end_date}</td>
      <td style={tableCellStyle}>
        {/* Buttons need to stop drag propagation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          style={{ marginRight: "5px" }}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInsert(event.week);
          }}
          style={{ marginRight: "5px" }}
        >
          Insert
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.week);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
