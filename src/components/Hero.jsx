import { useEffect, useState, useCallback, useRef } from "react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TrailerPlayer from "./TrailerPlayer";
import "./Hero.css";
import { useAuth } from "../context/AuthContext";

const Hero = ({ trendingMovies = [] }) => {
  const heroRef = useRef(null);
  const { VIDURL } = useAuth();

  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();

  // Pick Random Movie
  const pickRandomMovie = useCallback((list) => {
    if (!list || list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    setMovie(random);
  }, []);

  // Set initial movie once trendingMovies is loaded
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    pickRandomMovie(trendingMovies);
  }, [trendingMovies, pickRandomMovie]);

  // Auto switch movie every 30 sec
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      pickRandomMovie(trendingMovies);
    }, 30000);

    return () => clearInterval(interval);
  }, [trendingMovies, pickRandomMovie]);

  if (!movie) return null;

  const handleInfoClick = () => {
    navigate(
      movie.media_type === "movie" ? `/movie/${movie.id}` : `/tv/${movie.id}`
    );
  };

  const handlePlayClick = () => {
    let url;
    if (movie.media_type === "movie") {
      url = `${VIDURL}/movie/${movie.id}`;
    } else if (movie.media_type === "tv") {
      url = `${VIDURL}/tv/${movie.id}/1/1?color=ff0000&autoPlay=true&nextEpisode=true&episodeSelector=true`;
    }

    navigate(
      movie.media_type === "movie"
        ? `/movie/${movie.id}/play`
        : `/tv/${movie.id}/season/1/episode/1/play`,
      {
        state:
          movie.media_type === "movie"
            ? {
                mediaType: "movie",
                url,
                title: movie.title,
              }
            : {
                mediaType: "tv",
                url,
                title: `${movie.name} - S1E1`,
                tvId: movie.id,
                seriesName: movie.name,
                seasonNumber: 1,
                currentEpisodeNumber: 1,
              },
      }
    );
  };

  return (
    <div className="hero-container" ref={heroRef} data-testid="hero-section">
      <TrailerPlayer
        mediaId={movie.id}
        mediaType={movie.media_type}
        fallbackImage={movie.backdrop_path}
        heroRef={heroRef}
      />

      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="hero-content">
        <h1 className="hero-title" data-testid="hero-title">
          {movie.title || movie.name}
        </h1>

        <div className="hero-buttons">
          <button
            className="hero-btn play"
            onClick={handlePlayClick}
            data-testid="hero-play-button"
            aria-label={`Play ${movie.title || movie.name}`}
          >
            <FaPlay className="mr-2" aria-hidden="true" />
            Play
          </button>

          <button
            className="hero-btn info"
            onClick={handleInfoClick}
            data-testid="hero-info-button"
          >
            <FaInfoCircle className="mr-2" aria-hidden="true" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
