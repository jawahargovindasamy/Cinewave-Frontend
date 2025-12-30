import React, { useState } from "react";
import {
  FaPlus,
  FaCheck,
  FaRegStar,
  FaStar,
  FaBookmark,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ActionButtons = ({
  isInWatchlist,
  watchlistId,
  watchlistStatus,
  onAddToWatchlist,
  onStatusChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statusIcon = {
    plan_to_watch: <FaRegStar className="me-1" />,
    watching: <FaStar className="me-1" />,
    completed: <FaCheck className="me-1" />,
    on_hold: <FaBookmark className="me-1" />,
    dropped: <FaBookmark className="me-1" />,
  };

  const statusLabel = {
    plan_to_watch: "Plan to Watch",
    watching: "Watching",
    completed: "Completed",
    on_hold: "On Hold",
    dropped: "Dropped",
  };

  const handleAddClick = async () => {
    try {
      setIsAdding(true);
      await onAddToWatchlist();
      toast.success("watchlist updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update watchlist. Please try again.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleStatusClick = async (status) => {
    if (!watchlistId) return;
    try {
      setIsUpdatingStatus(true);
      await onStatusChange(watchlistId, status);
      toast.success(`Status updated to "${statusLabel[status]}"`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status. Please try again.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {/* Main Watchlist Button */}
      <button
        className={`btn btn-sm d-flex align-items-center gap-1 px-3 py-2 fw-bold ${
          isInWatchlist
            ? "btn-success border-0"
            : "btn-outline-light border-1"
        }`}
        onClick={handleAddClick}
        disabled={isAdding}
        style={{
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isAdding ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
            Loading
          </>
        ) : isInWatchlist ? (
          <>
            <FaCheck size={14} /> Added
          </>
        ) : (
          <>
            <FaPlus size={14} /> Add to List
          </>
        )}
      </button>

      {/* Watchlist Status Dropdown */}
      {isInWatchlist && (
        <div className="dropdown">
          <button
            className="btn btn-sm dropdown-toggle d-flex align-items-center gap-1 px-3 py-2 fw-bold border-1"
            data-bs-toggle="dropdown"
            disabled={isUpdatingStatus}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(13, 202, 240, 0.4)",
              color: "#0dcaf0",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(13, 202, 240, 0.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isUpdatingStatus ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : (
              statusIcon[watchlistStatus]
            )}
            <span className="fs-7">{statusLabel[watchlistStatus]}</span>
          </button>

          <ul
            className="dropdown-menu bg-dark border border-secondary"
            style={{ minWidth: "160px" }}
          >
            {Object.keys(statusLabel).map((s) => (
              <li key={s}>
                <button
                  className={`dropdown-item text-white d-flex align-items-center justify-content-between py-2 fs-7 ${
                    watchlistStatus === s ? "bg-primary bg-opacity-50" : ""
                  }`}
                  onClick={() => handleStatusClick(s)}
                  disabled={isUpdatingStatus}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                  }}
                >
                  <div className="d-flex align-items-center">
                    {statusIcon[s]}
                    {statusLabel[s]}
                  </div>
                  {watchlistStatus === s && (
                    <FaCheck className="text-success fs-7" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;