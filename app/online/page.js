"use client"; // This page is interactive, so it's a Client Component

import { useState } from "react";
import { useData } from "../../context/DataContext";
import SortableEventCard from "../../components/SortableEventCard"; // Import the new sortable one
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy, // Use this for a responsive flex-wrap layout
} from "@dnd-kit/sortable";

export default function OnlinePage() {
  const {
    onlineSeasons,
    reorderOnline,
    loading,
    updateEvent,
    deleteAndShift,
    insertAndShift,
  } = useData();
  const [view, setView] = useState("cards"); // 'cards' or 'table'

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only start drag after 8px move
      },
    })
  );

  if (loading) return <p>Loading data...</p>;

  // Handle drag-and-drop end
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = onlineSeasons.findIndex((c) => c.week === active.id);
    const newIndex = onlineSeasons.findIndex((c) => c.week === over.id);
    const reorderedList = arrayMove(onlineSeasons, oldIndex, newIndex);
    reorderOnline(reorderedList); // This will now also re-number
  };

  const handleEdit = (event) => {
    const newTitle = prompt("Enter new title:", event.title);
    if (newTitle) {
      updateEvent("online", { ...event, title: newTitle });
    }
  };
  const handleDelete = (week) => {
    if (
      confirm(
        `Are you sure you want to delete Week ${week} and shift all subsequent weeks?`
      )
    ) {
      deleteAndShift("online", week);
    }
  };

  const handleInsert = (week) => {
    if (
      confirm(
        `Are you sure you want to insert a new event at Week ${week} and shift all subsequent weeks?`
      )
    ) {
      insertAndShift("online", week);
    }
  };
  const buttonStyle = (v) => ({
    padding: "8px 16px",
    marginRight: "10px",
    cursor: "pointer",
    background: view === v ? "#1e90ff" : "white",
    color: view === v ? "white" : "#333",
    border: "1px solid #1e90ff",
    borderRadius: "4px",
  });

  return (
    <div>
      <h1>Online Battle Season Cycle</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("cards")} style={buttonStyle("cards")}>
          Card View
        </button>
        <button onClick={() => setView("table")} style={buttonStyle("table")}>
          Table View
        </button>
      </div>

      {view === "cards" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={onlineSeasons.map((c) => c.week)} // Pass array of unique IDs
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{ display: "flex", flexWrap: "wrap", padding: "10px 0" }}
            >
              {onlineSeasons.map((event) => (
                <SortableEventCard
                  key={event.week}
                  event={event}
                  onEdit={handleEdit}
                  onInsert={handleInsert} // <-- Add this
                  onDelete={handleDelete} // <-- Add this
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        // TABLE VIEW
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={tableCellStyle}>Week</th>
              <th style={tableCellStyle}>Cycle Wk</th>
              <th style={tableCellStyle}>Title</th>
              <th style={tableCellStyle}>Details</th>
              <th style={tableCellStyle}>Start Date</th>
              <th style={tableCellStyle}>End Date</th>
              <th style={tableCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {onlineSeasons.map((event) => (
              <tr key={event.week}>
                <td style={tableCellStyle}>{event.week}</td>
                <td style={tableCellStyle}>{event.cycle_week}</td>
                <td style={tableCellStyle}>{event.title}</td>
                <td style={tableCellStyle}>{event.details}</td>
                <td style={tableCellStyle}>{event.start_date}</td>
                <td style={tableCellStyle}>{event.end_date}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEdit(event)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Helper style for table
const tableCellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
};
