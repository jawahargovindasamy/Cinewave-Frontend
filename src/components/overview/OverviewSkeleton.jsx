import React from "react";

const OverviewSkeleton = () => {
  return (
    <div
      className="p-3 mx-2 rounded-3 shadow mb-4"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="row">
        <div className="col-12 col-md-4 col-lg-3 mb-3">
          <div
            className="rounded-3"
            style={{
              height: "300px",
              background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
              backgroundSize: "200% 100%",
              animation: "loading 1.5s infinite",
            }}
          ></div>
        </div>
        <div className="col-12 col-md-8 col-lg-9">
          <div
            className="mb-2"
            style={{
              height: "28px",
              background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
              backgroundSize: "200% 100%",
              animation: "loading 1.5s infinite",
              width: "60%",
              borderRadius: "4px",
            }}
          ></div>
          <div
            className="mb-3"
            style={{
              height: "80px",
              background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
              backgroundSize: "200% 100%",
              animation: "loading 1.5s infinite",
              borderRadius: "4px",
            }}
          ></div>
          <div className="d-flex gap-2 mb-3">
            <div
              style={{
                height: "38px",
                background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
                backgroundSize: "200% 100%",
                animation: "loading 1.5s infinite",
                width: "140px",
                borderRadius: "4px",
              }}
            ></div>
            <div
              style={{
                height: "38px",
                background: "linear-gradient(90deg, #222 25%, #333 50%, #222 75%)",
                backgroundSize: "200% 100%",
                animation: "loading 1.5s infinite",
                width: "140px",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSkeleton;