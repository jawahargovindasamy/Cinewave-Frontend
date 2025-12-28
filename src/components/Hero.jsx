import { useEffect, useState, useCallback, useRef } from "react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TrailerPlayer from "./TrailerPlayer";
import "./Hero.css";

const Hero = ({ trendingMovies = [] }) => {
  const heroRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [overviewExpanded, setOverviewExpanded] = useState(false);

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

  return (
    <div className="hero-container" ref={heroRef}>
      <TrailerPlayer
        mediaId={movie.id}
        mediaType={movie.media_type}
        fallbackImage={movie.backdrop_path}
        heroRef={heroRef}
      />

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        <div className={`overview-box ${overviewExpanded ? "open" : "closed"}`}>
          <p className="hero-desc">{movie.overview}</p>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-btn play"
            onClick={() => {
              navigate(
                movie.media_type === "movie"
                  ? `/movie/${movie.id}`
                  : `/tv/${movie.id}`
              );
            }}
          >
            <FaPlay className="mr-2" />
            Play
          </button>

          <button
            className="hero-btn info hide-mobile"
            onClick={() => setOverviewExpanded(!overviewExpanded)}
          >
            <FaInfoCircle className="mr-2" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
