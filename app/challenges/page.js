"use client";

import { useState } from "react";
import { useData } from "../../context/DataContext";
import SortableEventCard from "../../components/SortableEventCard";
import SortableEventRow from "../../components/SortableEventRow"; // <-- Import new component
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function ChallengesPage() {
  const {
    challenges,
    reorderChallenges,
    loading,
    updateEvent,
    deleteAndShift,
    insertAndShift,
  } = useData();

  const [view, setView] = useState("cards");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (loading) return <p>Loading data...</p>;

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = challenges.findIndex((c) => c.week === active.id);
    const newIndex = challenges.findIndex((c) => c.week === over.id);
    const reorderedList = arrayMove(challenges, oldIndex, newIndex);
    reorderChallenges(reorderedList);
  };

  const handleEdit = (event) => {
    const newTitle = prompt("Enter new title:", event.title);
    if (newTitle) {
      updateEvent("challenge", { ...event, title: newTitle });
    }
  };

  const handleDelete = (week) => {
    if (confirm(`Are you sure you want to delete Week ${week} and shift?`)) {
      deleteAndShift("challenge", week);
    }
  };

  const handleInsert = (week) => {
    if (
      confirm(
        `Are you sure you want to insert a new event at Week ${week} and shift?`
      )
    ) {
      insertAndShift("challenge", week);
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
      <h1>Challenge Mode Cycle</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("cards")} style={buttonStyle("cards")}>
          Card View
        </button>
        <button onClick={() => setView("table")} style={buttonStyle("table")}>
          Table View
        </button>
      </div>

      {/* DndContext now wraps both views */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        {view === "cards" ? (
          // --- CARD VIEW (Uses SortableEventCard) ---
          <SortableContext
            items={challenges.map((c) => c.week)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{ display: "flex", flexWrap: "wrap", padding: "10px 0" }}
            >
              {challenges.map((event) => (
                <SortableEventCard
                  key={event.week}
                  event={event}
                  onEdit={handleEdit}
                  onInsert={handleInsert}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        ) : (
          // --- TABLE VIEW (Uses SortableEventRow) ---
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
                <th style={tableCellStyle}>Title</th>
                <th style={tableCellStyle}>Start Date</th>
                <th style={tableCellStyle}>End Date</th>
                <th style={tableCellStyle}>Actions</th>
              </tr>
            </thead>
            {/* SortableContext wraps the <tbody> */}
            <SortableContext
              items={challenges.map((c) => c.week)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {challenges.map((event) => (
                  <SortableEventRow
                    key={event.week}
                    event={event}
                    onEdit={handleEdit}
                    onInsert={handleInsert}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        )}
      </DndContext>
    </div>
  );
}

// Helper style for table
const tableCellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
};
