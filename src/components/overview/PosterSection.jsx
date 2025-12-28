import React from "react";
import { MdLocalMovies } from "react-icons/md";

const PosterSection = ({ posterPath, title, voteAverage, mediaType }) => {
  return (
    <div className="position-relative overflow-hidden rounded-2">
      <img
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w342${posterPath}`
            : "/no-image.png"
        }
        alt={title}
        className="img-fluid w-100 shadow-sm"
        style={{
          aspectRatio: "2 / 3",
          objectFit: "cover",
        }}
      />

      {/* Rating Badge */}
      <div className="position-absolute top-0 end-0 p-2">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle border border-warning text-warning fw-semibold"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "rgba(0,0,0,0.85)",
            fontSize: "0.7rem",
          }}
        >
          {voteAverage ? voteAverage.toFixed(1) : "N/A"}
        </div>
      </div>

      {/* Media Type Badge */}
      <div className="position-absolute bottom-0 start-0 p-2">
        <div className="d-flex align-items-center gap-1 bg-dark bg-opacity-75 px-2 py-1 rounded-pill">
          <MdLocalMovies className="text-info" size={12} />
          <span className="text-white fw-semibold small">
            {mediaType === "movie" ? "MOVIE" : "TV"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PosterSection;
