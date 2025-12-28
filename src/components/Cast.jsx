import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cast = ({ id, mediaType }) => {
  const { apiCall } = useAuth();
  const [cast, setCast] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();

  const fallbackImg =
    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  useEffect(() => {
    const fetchCast = async () => {
      if (!id) return;
      const data = await apiCall(`/${mediaType}/${id}/credits`);
      setCast(data.cast || []);
    };

    fetchCast();
  }, [id, mediaType, apiCall]);

  if (!cast.length) return null;

  return (
    <div
      className="p-3 p-md-4 p-lg-5 mx-2 mx-md-4 mt-4 rounded-4 shadow-lg"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="bg-white rounded-3"
          style={{ width: "5px", height: "40px" }}
        ></div>
        <h3 className="fw-bold text-white mb-0">Cast</h3>
      </div>

      {/* CAST LIST - DESKTOP */}
      <div className="d-none d-md-block">
        <div className="row g-4">
          {cast.slice(0, 15).map((actor, index) => (
            <div
              key={actor.credit_id || actor.id}
              className="col-12 col-md-6 col-lg-4"
            >
              <div
                className="d-flex align-items-center rounded-3 p-3 cast-card"
                onClick={() => {
                  navigate(`/person/${actor.id}`);
                  window.scrollTo(0, 0);
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  transition: "0.3s ease",
                  transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hoverIndex === index
                      ? "0 10px 25px rgba(255, 255, 255, 0.25)"
                      : "0 3px 10px rgba(0,0,0,0.3)",
                }}
              >
                {/* IMAGE */}
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : fallbackImg
                  }
                  alt={actor.name}
                  className="rounded shadow-sm me-3"
                  style={{
                    width: "70px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                {/* INFO */}
                <div>
                  <p className="fw-semibold text-white mb-1">{actor.name}</p>
                  <p className="text-white-50 mb-0 small">{actor.character}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE HORIZONTAL SCROLL */}
      <div className="d-md-none">
        <div
          className="d-flex gap-3 overflow-auto pb-2"
          style={{
            whiteSpace: "wrap",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.3) transparent",
          }}
        >
          {cast.slice(0, 15).map((actor, index) => (
            <div
              key={actor.credit_id || actor.id}
              className="flex-shrink-0"
              style={{ width: "260px" }}
            >
              <div
                className="d-flex align-items-center rounded-3 shadow-sm p-3 cast-card"
                onClick={() => {
                  navigate(`/person/${actor.id}`);
                  window.scrollTo(0, 0);
                }}
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  transition: "0.3s ease",
                }}
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : fallbackImg
                  }
                  alt={actor.name}
                  className="rounded shadow-sm me-3"
                  style={{
                    width: "70px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <p className="fw-semibold text-white mb-1">{actor.name}</p>
                  <p className="text-white-50 mb-0 small">{actor.character}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCROLLBAR + HOVER STYLE */}
      <style>
        {`
          .d-md-none::-webkit-scrollbar {
            height: 6px;
          }
          .d-md-none::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.4);
            border-radius: 10px;
          }
          .d-md-none::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
          }

          .cast-card:hover {
            background: rgba(255,255,255,0.12) !important;
          }
        `}
      </style>
    </div>
  );
};

export default Cast;
