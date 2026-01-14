import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../context/usePageTitle";

const SAVE_INTERVAL = 10; // seconds

const VideoPlayer = () => {
  const { backendAPI, user } = useAuth();
  const location = useLocation();

  /* -------------------- STATE -------------------- */
  const [playerState, setPlayerState] = useState(location.state || {});

  const {
    url,
    mediaType,
    title,
    seriesName,
    seasonNumber,
    currentEpisodeNumber,
  } = playerState || {};

  /* -------------------- PAGE TITLE -------------------- */
  const pageTitle =
    mediaType === "tv"
      ? `${seriesName} – S${seasonNumber}E${currentEpisodeNumber}`
      : title;

  usePageTitle(pageTitle || "Player");

  /* -------------------- THROTTLE REFS -------------------- */
  const lastSavedTimeRef = useRef(0);

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

      try {
        /* ---------- SAVE WATCHING PROGRESS (THROTTLED) ---------- */
        if (playerEvent === "timeupdate" || playerEvent === "pause") {
          const shouldSave =
            playerEvent === "pause" ||
            currentTime - lastSavedTimeRef.current >= SAVE_INTERVAL;

          if (shouldSave) {
            lastSavedTimeRef.current = currentTime;

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
        }

        /* ---------- MARK COMPLETED ---------- */
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

  /* -------------------- UI -------------------- */
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <iframe
        key={url}
        src={url}
        width="100%"
        height="100%"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || "Video Player"}
      />
    </div>
  );
};

export default VideoPlayer;
