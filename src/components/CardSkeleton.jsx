import React from "react";

const CardSkeleton = ({ height = 300 }) => {
  return (
    <div
      className="skeleton w-100"
      style={{
        height: `${height}px`,
        borderRadius: "12px",
        minHeight: "200px",
      }}
      role="status"
      aria-label="Loading content"
      data-testid="card-skeleton"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default CardSkeleton;
