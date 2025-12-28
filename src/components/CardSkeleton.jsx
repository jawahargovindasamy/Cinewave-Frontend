import React from "react";

const CardSkeleton = ({ height = 300 }) => {
  return (
    <div
      className="placeholder-wave w-100"
      style={{
        height: `${height}px`,
        borderRadius: "8px",
        backgroundColor: "#1a1a1a",
      }}
    >
      <span
        className="placeholder d-block w-100 h-100"
        style={{ borderRadius: "8px" }}
      ></span>
    </div>
  );
};

export default CardSkeleton;
