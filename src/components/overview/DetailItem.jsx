import React from "react";

const DetailItem = ({ icon, label, value }) => (
  <div className="col-12 col-sm-6 col-md-4">
    <div
      className="p-2 rounded-2 h-100"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="d-flex align-items-center gap-1 mb-1">
        {icon}
        <small className="text-white mb-0 fw-semibold fs-7">{label}</small>
      </div>
      <p className="text-white mb-0 fw-bold fs-6">{value}</p>
    </div>
  </div>
);

export default DetailItem;