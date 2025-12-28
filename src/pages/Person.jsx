import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MediaCard from "../components/MediaCard";

const fallbackImg =
  "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

const Person = () => {
  const { id } = useParams();
  const { apiCall } = useAuth();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "movies";

  const [showFullBio, setShowFullBio] = useState(false);

  // -------- Remove Duplicate Movies/TV Shows -------- //
  const uniqueById = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPerson = async () => {
      const data = await apiCall(`/person/${id}`);
      setPerson(data);
    };

    const fetchCombinedCredits = async () => {
      const data = await apiCall(`/person/${id}/combined_credits`);

      const movies = uniqueById(
        data.cast?.filter((i) => i.media_type === "movie") || []
      );

      const tv = uniqueById(
        data.cast?.filter((i) => i.media_type === "tv") || []
      );

      setMovieCredits(movies);
      setTvCredits(tv);
    };

    fetchPerson();
    fetchCombinedCredits();
  }, [id, apiCall]);

  // Handle navigation with smooth scroll
  const handleMediaClick = (mediaType, mediaId) => {
    navigate(`/${mediaType}/${mediaId}`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;

    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (!person) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-warning"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading person details...</p>
        </div>
      </div>
    );
  }

  // Handle Biography toggle logic
  const slicedBio = person.biography?.slice(0, 300);
  const isLongBio = person.biography?.length > 300;

  return (
    <div
      className="min-vh-100 pb-5"
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #1a1a1a 100%)",
      }}
    >
      <Navbar />

      <div className="container-fluid container-xl px-3 px-md-4 py-4">
        {/* ==================== PERSON HEADER ==================== */}
        <div
          className="row g-3 g-md-4 p-3 p-md-4 p-lg-5 rounded-4 shadow-lg mt-3 mt-md-4 mb-4 mb-md-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 193, 7, 0.1)",
          }}
        >
          {/* ----- IMAGE ----- */}
          <div className="col-12 col-md-5 col-lg-4 d-flex justify-content-center justify-content-md-start">
            <div className="position-relative">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    : fallbackImg
                }
                className="rounded-4 shadow-lg img-fluid"
                alt={person.name}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  objectFit: "cover",
                  border: "3px solid rgba(255, 193, 7, 0.3)",
                }}
              />
              <div
                className="position-absolute bottom-0 start-0 w-100 p-3 rounded-bottom-4"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                }}
              >
                <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-md-start">
                  <span className="badge bg-warning text-dark px-3 py-2">
                    ⭐ {person.popularity?.toFixed(1)}
                  </span>
                  <span className="badge bg-dark text-warning px-3 py-2">
                    {person.known_for_department}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ----- INFO ----- */}
          <div className="col-12 col-md-7 col-lg-8 d-flex flex-column justify-content-center">
            <h1
              className="fw-bold mb-3 mb-md-4 display-5 display-md-4"
              style={{
                letterSpacing: "1px",
                background: "linear-gradient(90deg, #ffc107, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {person.name}
            </h1>

            {/* Biography Short Preview */}
            {person.biography && (
              <p
                className="text-white-50 mb-3 fs-6 fs-md-5"
                style={{
                  lineHeight: "1.8",
                  textAlign: "justify",
                }}
              >
                {!showFullBio && slicedBio}
                {!showFullBio && isLongBio && "... "}
                {showFullBio && person.biography}
              </p>
            )}

            {/* Toggle Button */}
            {isLongBio && (
              <button
                className="btn btn-outline-warning btn-sm mb-3 align-self-start px-4"
                onClick={() => setShowFullBio(!showFullBio)}
                style={{ transition: "all 0.3s ease" }}
              >
                {showFullBio ? "Show Less ▲" : "Read More ▼"}
              </button>
            )}

            <div className="row g-3 mt-2">
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-warning fw-bold"
                    style={{ minWidth: "40px" }}
                  >
                    📅
                  </span>
                  <div>
                    <small className="text-white-50 d-block">Born</small>
                    <span className="text-white">
                      {person.birthday
                        ? `${person.birthday} (${calculateAge(
                            person.birthday
                          )} years old)`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-warning fw-bold"
                    style={{ minWidth: "40px" }}
                  >
                    👤
                  </span>
                  <div>
                    <small className="text-white-50 d-block">Gender</small>
                    <span className="text-white">
                      {person.gender === 1
                        ? "Female"
                        : person.gender === 2
                        ? "Male"
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-warning fw-bold"
                    style={{ minWidth: "40px" }}
                  >
                    🎬
                  </span>
                  <div>
                    <small className="text-white-50 d-block">Known For</small>
                    <span className="text-white">
                      {person.known_for_department || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-warning fw-bold"
                    style={{ minWidth: "40px" }}
                  >
                    📍
                  </span>
                  <div>
                    <small className="text-white-50 d-block">
                      Place of Birth
                    </small>
                    <span className="text-white">
                      {person.place_of_birth || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== TABS SECTION ==================== */}
        <div
          className="d-flex gap-2 gap-md-3 mb-4 pb-3 border-bottom flex-wrap"
          style={{ borderColor: "rgba(255, 193, 7, 0.3)" }}
        >
          <button
            className={`btn px-4 py-2 fw-bold ${
              activeTab === "movies"
                ? "btn-warning text-dark"
                : "btn-outline-warning"
            }`}
            style={{ transition: "all 0.3s ease", minWidth: "140px" }}
            onClick={() => setSearchParams({ tab: "movies" })}
          >
            🎬 Movies ({movieCredits.length})
          </button>

          <button
            className={`btn px-4 py-2 fw-bold ${
              activeTab === "tv"
                ? "btn-warning text-dark"
                : "btn-outline-warning"
            }`}
            style={{ transition: "all 0.3s ease", minWidth: "140px" }}
            onClick={() => setSearchParams({ tab: "tv" })}
          >
            📺 TV Shows ({tvCredits.length})
          </button>
        </div>

        {/* ==================== MOVIES SECTION ==================== */}
        {activeTab === "movies" && (
          <div className="animate-fade-in">
            {movieCredits.length > 0 ? (
              <div className="row g-2 g-md-3 g-lg-4">
                {movieCredits.map((item) => (
                  <div
                    key={`movie-${item.id}`}
                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                  >
                    <div className="movie-card-wrapper">
                      <MediaCard
                        image={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                            : fallbackImg
                        }
                        title={item.title}
                        rating={item.vote_average}
                        onClick={() => handleMediaClick("movie", item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white-50 py-5">
                <p className="fs-5">No movies found</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== TV SECTION ==================== */}
        {activeTab === "tv" && (
          <div className="animate-fade-in">
            {tvCredits.length > 0 ? (
              <div className="row g-2 g-md-3 g-lg-4">
                {tvCredits.map((item) => (
                  <div
                    key={`tv-${item.id}`}
                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                  >
                    <div className="movie-card-wrapper">
                      <MediaCard
                        image={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                            : fallbackImg
                        }
                        title={item.name}
                        rating={item.vote_average}
                        onClick={() => handleMediaClick("tv", item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white-50 py-5">
                <p className="fs-5">No TV shows found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          /* Fade In Animation */
          .animate-fade-in {
            animation: fadeIn 0.4s ease-in;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Button Hover Effects */
          .btn-outline-warning:hover {
            background: rgba(255, 193, 7, 0.1) !important;
            transform: translateY(-2px);
          }

          @media (max-width: 576px) {
            .display-5 {
              font-size: 1.8rem !important;
            }
            
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .display-5 {
              font-size: 2.2rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Person;
