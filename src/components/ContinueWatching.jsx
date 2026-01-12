import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
const ContinueWatching = () => {
  const {
    user,
    continueWatching,
    continueWatchingLoading,
    loadContinueWatching,
    removeContinueWatching,
    VIDURL,
    apiCall,
    backendAPI
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isContinuePage = location.pathname === "/continue-watching";

  const scrollRef = useRef(null);

  const [hoveredId, setHoveredId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    if (user) loadContinueWatching();
  }, [user]);

  /* -------------------- SCROLL ARROWS -------------------- */
  useEffect(() => {
    if (!isHomePage || !scrollRef.current) return;

    const el = scrollRef.current;

    const updateArrows = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    updateArrows();
    el.addEventListener("scroll", updateArrows);
    return () => el.removeEventListener("scroll", updateArrows);
  }, [isHomePage, continueWatching]);

  /* -------------------- FILTER LATEST PER TV (HOME ONLY) -------------------- */
  const filteredContinueWatching = useMemo(() => {
    if (!continueWatching?.length) return [];

    const tvMap = new Map();
    const movies = [];

    for (const item of continueWatching) {
      if (item.mediaType === "movie") {
        movies.push(item);
        continue;
      }

      const existing = tvMap.get(item.mediaId);

      if (!existing) {
        tvMap.set(item.mediaId, item);
      } else {
        const existingTime = new Date(
          existing.updatedAt || existing.createdAt || 0
        );
        const currentTime = new Date(item.updatedAt || item.createdAt || 0);

        if (currentTime > existingTime) {
          tvMap.set(item.mediaId, item);
        }
      }
    }

    return [...movies, ...tvMap.values()].sort((a, b) => {
      const timeA = new Date(
        a.lastWatchedAt || a.updatedAt || a.createdAt || 0
      );
      const timeB = new Date(
        b.lastWatchedAt || b.updatedAt || b.createdAt || 0
      );
      return timeB - timeA;
    });
  }, [continueWatching]);

  /* -------------------- DATA SOURCE BASED ON ROUTE -------------------- */
  const listToRender = isContinuePage
    ? continueWatching
    : filteredContinueWatching;

  /* -------------------- HANDLERS -------------------- */
  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const handlePlay = async (item) => {

    if (user) {

      try {
        await backendAPI.post("/continue-watching", {
          mediaId: item.mediaId,
          mediaType : "tv",
          seasonNumber: Number(item.seasonNumber),
          episodeNumber: Number(item.episodeNumber),
        });
      } catch (error) {
        console.error("Failed to update continue watching:", error);
      }
    }

  let url,
    path,
    allEpisodeNumbers = [];

  if (item.mediaType === "movie") {
    url = `${VIDURL}/movie/${item.mediaId}`;
    path = `/movie/${item.mediaId}/play`;
  } else {
    try {

      const seasonData = await apiCall(
        `/tv/${item.mediaId}/season/${item.seasonNumber}`
      );

      allEpisodeNumbers = (seasonData.episodes || [])
        .sort((a, b) => a.episode_number - b.episode_number)
        .map((ep) => ep.episode_number);
    } catch (err) {
      console.error("Failed to fetch TMDB episodes:", err);
    }

    url = `${VIDURL}/tv/${item.mediaId}/${item.seasonNumber}/${item.episodeNumber}`;
    path = `/tv/${item.mediaId}/season/${item.seasonNumber}/episode/${item.episodeNumber}/play`;
  }

  navigate(path, {
    state: {
      url,
      title:
        item.mediaType === "tv"
          ? `${item.title} - S${item.seasonNumber}E${item.episodeNumber}`
          : item.title,
      tvId: item.mediaId,
      seriesName: item.title,
      seasonNumber: item.seasonNumber,
      currentEpisodeNumber: item.episodeNumber,
      allEpisodeNumbers,
    },
  });
};


  const handleRemove = async (e, item) => {
    e.stopPropagation();
    try {
      await removeContinueWatching({
        mediaType: item.mediaType,
        mediaId: item.mediaId,
        seasonNumber: item.seasonNumber,
        episodeNumber: item.episodeNumber,
      });
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  /* -------------------- STATES -------------------- */
  if (!user || continueWatchingLoading) return null;

  if (isHomePage && !filteredContinueWatching.length) return null;

  const isEmpty = isContinuePage && !continueWatching?.length;

  /* -------------------- RENDER -------------------- */
  return (
    <div
      className={`bg-black text-white ${
        isContinuePage ? "min-vh-100 d-flex flex-column" : ""
      }`}
    >
      {isContinuePage && (
        <div className="mb-4 pb-4">
          <Navbar />
        </div>
      )}

      {isEmpty ? (
        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3">
          <h3>Your Continue Watching list is empty</h3>
          <p className="text-muted mb-3">
            Start watching movies or TV shows to see them here!
          </p>
          <button className="btn btn-danger" onClick={() => navigate("/")}>
            Browse Movies & TV Shows
          </button>
        </div>
      ) : (
        <section className="position-relative flex-grow-1">
          <div className="container-fluid px-4 pt-4">
            <h3
              className={
                isContinuePage ? "text-center fw-bold mb-4" : "fw-bold mb-3"
              }
            >
              Continue Watching for {user.name}
            </h3>
          </div>

          {isHomePage && canScrollLeft && (
            <button
              className="scroll-arrow left"
              onClick={() => scroll("left")}
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={scrollRef}
            className={
              isHomePage
                ? "d-flex gap-3 overflow-auto continue-scroll px-4 pb-4"
                : "container-fluid px-4 pb-5"
            }
          >
            <div className={isHomePage ? "d-flex gap-3" : "row g-4"}>
              {listToRender.map((item) => (
                <div
                  key={item._id}
                  className={
                    isHomePage
                      ? "continue-item"
                      : "col-6 col-md-4 col-lg-3"
                  }
                  onMouseEnter={() => setHoveredId(item._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className="position-relative rounded-3 overflow-hidden bg-dark"
                    style={{ aspectRatio: "16 / 9", cursor: "pointer" }}
                    onClick={() => handlePlay(item)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
                      alt={item.title}
                      className="w-100 h-100 object-fit-cover"
                    />

                    {hoveredId === item._id && (
                      <>
                        <div className="overlay-center">
                          <FaPlay />
                        </div>
                        <button
                          className="remove-btn"
                          onClick={(e) => handleRemove(e, item)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                    <div className="title-overlay">
                      <h6 className="mb-0">{item.title}</h6>
                      {item.mediaType === "tv" && (
                        <small>
                          S{item.seasonNumber} E{item.episodeNumber}
                        </small>
                      )}
                    </div>

                    {item.progress > 0 && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isHomePage && canScrollRight && (
            <button
              className="scroll-arrow right"
              onClick={() => scroll("right")}
            >
              <FaChevronRight />
            </button>
          )}
        </section>
      )}

      <style>{`
        .continue-scroll::-webkit-scrollbar { display: none; }
        .continue-scroll { scrollbar-width: none; }
        .continue-item { min-width: 280px; max-width: 280px; flex-shrink: 0; }
        .scroll-arrow { position: absolute; top: 55%; transform: translateY(-50%); width: 42px; height: 42px; border-radius: 50%; border: none; background: rgba(0,0,0,0.75); color: white; z-index: 10; }
        .scroll-arrow.left { left: 10px; }
        .scroll-arrow.right { right: 10px; }
        .overlay-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); font-size: 22px; }
        .remove-btn { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%; background: rgba(0,0,0,0.8); border: none; color: white; }
        .title-overlay { position: absolute; bottom: 0; width: 100%; padding: 10px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
        .progress-bar { position: absolute; bottom: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.2); }
        .progress-fill { height: 100%; background: #dc3545; }
      `}</style>
    </div>
  );
};

export default ContinueWatching;
