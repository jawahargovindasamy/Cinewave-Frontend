import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPlay } from "react-icons/fa";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import TrailerPlayer from "./TrailerPlayer";

const MovieHero = ({ id, mediaType }) => {
  const { apiCall, VIDURL, backendAPI, user } = useAuth();
  const heroRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);


  const navigate = useNavigate();

  // Fetch movie/tv details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      const m = await apiCall(`/${mediaType}/${id}`);
      setMovie(m);

      // For TV shows, set default season and episode
      if (mediaType === "tv" && m?.seasons?.length > 0) {
        setSeason(m.seasons[0].season_number);
        setEpisode(m.seasons[0]?.episodes?.[0]?.episode_number || 1);
      }
      setLoading(false);
    };

    fetchMovie();
  }, [id, mediaType, apiCall]);

  if (loading || !movie) return null;

  const handlePlay = async () => {
    if (user) {
      try {
        await backendAPI.post("/continue-watching", {
          mediaId: id,
          mediaType,
          seasonNumber: mediaType === "tv" ? season : null,
          episodeNumber: mediaType === "tv" ? episode : null,
        });
      } catch (error) {
        console.error("Failed to update continue watching:", error);
      }
    }

    let url;
    if (mediaType === "movie") {
      url = `${VIDURL}/movie/${id}`;
    } else if (mediaType === "tv") {
      url = `${VIDURL}/tv/${id}/${season}/${episode}?color=ff0000&autoPlay=true&nextEpisode=true&episodeSelector=true`;
    }

    let allEpisodeNumbers = [];

    if (mediaType === "tv") {
      const seasonData = movie.seasons.find((s) => s.season_number === season);

      if (seasonData?.episode_count) {
        allEpisodeNumbers = Array.from(
          { length: seasonData.episode_count },
          (_, i) => i + 1
        );
      }
    }

    navigate(
      mediaType === "movie"
        ? `/movie/${id}/play`
        : `/tv/${id}/season/${season}/episode/${episode}/play`,
      {
        state:
          mediaType === "movie"
            ? {
                mediaType: "movie",
                url,
                title: movie.title,
              }
            : {
                mediaType: "tv",
                url,
                title: `${movie.name} - S${season}E${episode}`,
                tvId: id,
                seriesName: movie.name,
                seasonNumber: season,
                currentEpisodeNumber: episode,
                allEpisodeNumbers,
              },
      }
    );
  };

  return (
    <div className="hero-container" ref={heroRef}>
      <TrailerPlayer
        mediaId={id}
        mediaType={mediaType}
        fallbackImage={movie.backdrop_path}
        heroRef={heroRef}
      />

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        <div className="hero-buttons">
          <button className="hero-btn play" onClick={handlePlay}>
            <FaPlay className="mr-2" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
