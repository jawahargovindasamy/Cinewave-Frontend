import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../context/usePageTitle";

const VideoPlayer = () => {
  const { backendAPI, user } = useAuth();
  const location = useLocation();

  /* -------------------- STATE -------------------- */
  const [playerState, setPlayerState] = useState(location.state);

  const {
    url,
    mediaType,
    title,
    tvId,
    seriesName,
    seasonNumber,
    currentEpisodeNumber,
    allEpisodeNumbers = [],
  } = playerState || {};

  /* -------------------- PAGE TITLE -------------------- */
  const pageTitle =
    mediaType === "tv"
      ? `${seriesName} – S${seasonNumber}E${currentEpisodeNumber}`
      : title;

  usePageTitle(pageTitle || "Player");

  /* -------------------- VIDKING MESSAGE LISTENER -------------------- */
  useEffect(() => {
    if (!user) return;

    const handleMessage = async (event) => {
      if (typeof event.data !== "string") return;

      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      if (payload?.type !== "PLAYER_EVENT") return;

      const {
        event: playerEvent,
        currentTime,
        duration,
        progress,
        id,
        mediaType: msgMediaType,
        season,
        episode,
      } = payload.data;

      // Debug if needed
      // console.log("VidKing:", payload.data);

      try {
        // SAVE WATCHING PROGRESS
        if (playerEvent === "timeupdate" || playerEvent === "pause") {
          await backendAPI.post("/continue-watching", {
            mediaId: Number(id),
            mediaType: msgMediaType,
            seasonNumber: season ?? null,
            episodeNumber: episode ?? null,
            currentTime,
            duration,
            progress,
            status: "watching",
          });
        }

        // MARK COMPLETED
        if (playerEvent === "ended") {
          await backendAPI.post("/continue-watching", {
            mediaId: Number(id),
            mediaType: msgMediaType,
            seasonNumber: season ?? null,
            episodeNumber: episode ?? null,
            currentTime: duration,
            duration,
            progress: 100,
            status: "completed",
          });
        }
      } catch (err) {
        console.error("Progress save failed:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [user, backendAPI]);

  /* -------------------- FETCH EPISODES (SAFE FALLBACK) -------------------- */
  useEffect(() => {
    if (!tvId || !seasonNumber) return;
    if (allEpisodeNumbers.length) return;

    const fetchEpisodes = async () => {
      try {
        const res = await backendAPI.get(
          `/tv/${tvId}/season/${seasonNumber}/episodes`
        );

        const episodeNumbers = res.data.map((ep) => ep.episode_number);

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

  /* -------------------- UI -------------------- */
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <iframe
        key={url}
        src={url}
        width="100%"
        height="100%"
        allowFullScreen
        title={title || "Video Player"}
      />
    </div>
  );
};

export default VideoPlayer;
