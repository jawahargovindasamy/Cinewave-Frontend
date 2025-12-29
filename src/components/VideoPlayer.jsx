import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const VideoPlayer = () => {
  const { VIDURL, backendAPI, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 IMPORTANT: initialize ONCE from location.state
  const [playerState, setPlayerState] = useState(location.state);
  const [showNav, setShowNav] = useState(true);
  const hideTimeout = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* -------------------- RESPONSIVE -------------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!playerState?.url) return null;

  const {
    url,
    title,
    tvId,
    seriesName,
    seasonNumber,
    currentEpisodeNumber,
    allEpisodeNumbers = [],
  } = playerState;

  /* -------------------- FETCH EPISODES (CONTINUE WATCHING FIX) -------------------- */
  useEffect(() => {
    if (!tvId || !seasonNumber) return;
    if (allEpisodeNumbers.length) return;

    const fetchEpisodes = async () => {
      try {
        const res = await backendAPI.get(
          `/tv/${tvId}/season/${seasonNumber}/episodes`
        );

        const episodeNumbers = res.data.map(
          (ep) => ep.episode_number
        );

        setPlayerState((prev) => ({
          ...prev,
          allEpisodeNumbers: episodeNumbers,
        }));
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

    fetchEpisodes();
  }, [tvId, seasonNumber, allEpisodeNumbers.length, backendAPI]);

  /* -------------------- NEXT / PREVIOUS LOGIC -------------------- */
  const currentIndex = allEpisodeNumbers.indexOf(currentEpisodeNumber);
  const hasNext =
    currentIndex !== -1 && currentIndex < allEpisodeNumbers.length - 1;
  const hasPrevious = currentIndex !== -1 && currentIndex > 0;

  const updateContinueWatching = async (episodeNumber) => {
    if (!user || !tvId) return;
    try {
      await backendAPI.post("/continue-watching", {
        mediaId: tvId,
        mediaType: "tv",
        seasonNumber,
        episodeNumber,
      });
    } catch (error) {
      console.error("Continue watching update failed:", error);
    }
  };

  const handleNext = async () => {
    if (!hasNext) return;

    const nextEpisodeNumber = allEpisodeNumbers[currentIndex + 1];
    await updateContinueWatching(nextEpisodeNumber);

    const nextPlayerState = {
      ...playerState,
      url: `${VIDURL}/tv/${tvId}/${seasonNumber}/${nextEpisodeNumber}`,
      title: `${seriesName} - S${seasonNumber}E${nextEpisodeNumber}`,
      currentEpisodeNumber: nextEpisodeNumber,
    };

    setPlayerState(nextPlayerState);

    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${nextEpisodeNumber}/play`,
      { replace: true, state: nextPlayerState }
    );
  };

  const handlePrevious = async () => {
    if (!hasPrevious) return;

    const prevEpisodeNumber = allEpisodeNumbers[currentIndex - 1];
    await updateContinueWatching(prevEpisodeNumber);

    const prevPlayerState = {
      ...playerState,
      url: `${VIDURL}/tv/${tvId}/${seasonNumber}/${prevEpisodeNumber}`,
      title: `${seriesName} - S${seasonNumber}E${prevEpisodeNumber}`,
      currentEpisodeNumber: prevEpisodeNumber,
    };

    setPlayerState(prevPlayerState);

    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${prevEpisodeNumber}/play`,
      { replace: true, state: prevPlayerState }
    );
  };

  /* -------------------- AUTO HIDE NAV -------------------- */
  const resetHideTimeout = () => {
    if (isMobile) return;
    setShowNav(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowNav(false), 3000);
  };

  useEffect(() => {
    resetHideTimeout();
    return () => clearTimeout(hideTimeout.current);
  }, [playerState, isMobile]);

  /* -------------------- UI -------------------- */
  return (
    <div
      className="position-relative bg-black"
      style={{ height: "100vh", width: "100vw" }}
      onMouseMove={resetHideTimeout}
    >
      {/* NAV BAR */}
      <div
        className={`position-absolute w-100 d-flex justify-content-between align-items-center px-3 py-3
          ${showNav || isMobile ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "opacity 0.4s ease",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0))",
        }}
      >
        {/* BACK */}
        <div
          className="d-flex align-items-center gap-3 text-white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={26} />
          <span className="fw-semibold">{title}</span>
        </div>

        {/* CONTROLS */}
        <div className="d-flex gap-3">
          {hasPrevious && (
            <button
              className="btn btn-outline-light d-flex align-items-center gap-2"
              onClick={handlePrevious}
            >
              <MdSkipPrevious size={24} />
              <span className="d-none d-md-inline">Previous</span>
            </button>
          )}

          {hasNext && (
            <button
              className="btn btn-outline-light d-flex align-items-center gap-2"
              onClick={handleNext}
            >
              <MdSkipNext size={24} />
              <span className="d-none d-md-inline">Next</span>
            </button>
          )}
        </div>
      </div>

      {/* VIDEO */}
      <div style={{ paddingTop: "60px", height: "calc(100vh - 60px)" }}>
        <iframe
          key={url}
          src={url}
          width="100%"
          height="100%"
          allow="autoplay; encrypted-media; clipboard-write"
          allowFullScreen
          title={title || "Video Player"}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
