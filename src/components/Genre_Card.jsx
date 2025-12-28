import React from "react";

const Genre_Card = ({ icon, name }) => {

  return (
    <div
      className="text-white d-flex flex-column justify-content-center align-items-center gap-1"
      style={{
        height: "90px",
        borderRadius: "8px",
        background: "#111111",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        border: "1px solid #222",
        fontSize: "15px",
        padding: "8px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "22px" }}>{icon}</div>
      <div style={{ textAlign: "center", fontSize: "0.95rem" }}>{name}</div>
    </div>
  );
};

export default Genre_Card;
