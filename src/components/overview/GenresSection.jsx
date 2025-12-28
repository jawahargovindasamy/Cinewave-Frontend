import React from "react";
import { Link } from "react-router-dom";
import { FaTheaterMasks } from "react-icons/fa";

const GenresSection = ({ genres, mediaType }) => {
  return (
    <div className="mt-3">
      <div className="d-flex align-items-center gap-1 mb-2">
        <FaTheaterMasks className="text-warning fs-6" />
        <h6 className="text-white fw-semibold mb-0 fs-6">Genres</h6>
      </div>

      <div className="d-flex flex-wrap gap-1">
        {genres.map((g) => (
          <Link
            key={g.id}
            to={`/genre/${mediaType}/${g.id}`}
            state={{ genreName: g.name }}
            onClick={() => window.scrollTo(0, 0)}
            className="badge px-2 py-1 rounded-pill text-decoration-none fs-7"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.15)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.08)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {g.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresSection;