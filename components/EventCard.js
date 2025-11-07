export default function EventCard({ event, onEdit, onInsert, onDelete }) {
  // Add props
  const cardStyle = {
    // ... (same as before)
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "10px",
    width: "300px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    background: "#fff",
    cursor: "grab",
  };

  // ... (titleStyle, dateStyle same as before) ...

  // Button styles
  const buttonStyle = {
    marginTop: "10px",
    padding: "5px 10px",
    cursor: "pointer",
    marginRight: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    borderColor: "#ff4d4d",
    background: "#ffefef",
    color: "#ff4d4d",
  };

  return (
    <div style={cardStyle}>
      {/* ... (title, date, week, details, cycle_week) ... */}
      <div style={cardStyle}>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#333",
          }}
        >
          {event.title}
        </div>
        <div
          style={{ fontSize: "0.9rem", color: "#555", marginBottom: "10px" }}
        >
          {event.start_date} to {event.end_date}
        </div>
        <p style={{ margin: "4px 0" }}>Week: {event.week}</p>
        {event.details && (
          <p style={{ margin: "4px 0" }}>Details: {event.details}</p>
        )}
        {event.cycle_week && (
          <p style={{ margin: "4px 0" }}>Cycle Week: {event.cycle_week}</p>
        )}
      </div>

      {/* --- UPDATED BUTTONS --- */}
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          style={buttonStyle}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInsert(event.week);
          }}
          style={buttonStyle}
        >
          Insert Before
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.week);
          }}
          style={deleteButtonStyle}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
