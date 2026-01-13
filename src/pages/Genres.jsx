import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import {
  FaFilm,
  FaTv,
  FaTheaterMasks,
  FaRunning,
  FaLaugh,
  FaSkullCrossbones,
  FaSpaceShuttle,
  FaHeart,
  FaMusic,
  FaPuzzlePiece,
  FaGhost,
  FaGlobe,
  FaDragon,
  FaBook,
  FaRobot,
  FaChild,
  FaNewspaper,
  FaFlag,
  FaCameraRetro,
} from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import { RiMovie2Fill } from "react-icons/ri";
import Genre_Card from "../components/Genre_Card";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../context/usePageTitle";

const genreIcons = {
  Action: <FaRunning />,
  Adventure: <FaSpaceShuttle />,
  Animation: <FaDragon />,
  Comedy: <FaLaugh />,
  Crime: <FaSkullCrossbones />,
  Documentary: <FaBook />,
  Drama: <FaTheaterMasks />,
  Family: <FaHeart />,
  Fantasy: <FaDragon />,
  History: <FaBook />,
  Horror: <FaGhost />,
  Music: <FaMusic />,
  Mystery: <FaPuzzlePiece />,
  Romance: <FaHeart />,
  "Science Fiction": <FaRobot />,
  "TV Movie": <FaFilm />,
  Thriller: <FaSkullCrossbones />,
  War: <FaFlag />,
  Western: <FaFilm />,
  "Action & Adventure": <GiPistolGun />,
  "Sci-Fi & Fantasy": <FaRobot />,
  Kids: <FaChild />,
  News: <FaNewspaper />,
  Reality: <FaCameraRetro />,
  Soap: <FaTheaterMasks />,
  Talk: <FaTheaterMasks />,
  "War & Politics": <FaFlag />,
  TV: <FaTv />,
};

const Genres = () => {
  const { apiCall } = useAuth();

  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTVGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageTitle("Genres");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const movieData = await apiCall("/genre/movie/list");
      const tvData = await apiCall("/genre/tv/list");

      setMovieGenres(movieData.genres || []);
      setTVGenres(tvData.genres || []);
      setLoading(false);
    };
    fetchGenres();
  }, [apiCall]);

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-4">
        <Navbar />
      </div>

      <div className="px-4 py-4 mt-5 mt-md-4">
        <h3 className="text-white fw-bold mb-4">Genres</h3>

        {/* Movie Genres */}
        <h5 className="text-white mb-3 d-flex align-items-center gap-2">
          <FaFilm /> Movie Genres
        </h5>

        {/* Movie Loader Skeleton */}
        {loading ? (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 mb-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="col">
                <div
                  className="placeholder-wave rounded-3"
                  style={{
                    height: "110px",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <span className="placeholder d-block w-100 h-100 rounded-3"></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 mb-5">
            {movieGenres.map((genre) => (
              <div
                key={genre.id}
                className="col"
                onClick={() => {
                  navigate(`/genre/movie/${genre.id}`, {
                    state: { genreName: genre.name },
                  });
                  window.scrollTo(0, 0);
                }}
              >
                <Genre_Card
                  icon={genreIcons[genre.name] || <FaFilm />}
                  name={genre.name}
                />
              </div>
            ))}
          </div>
        )}

        {/* TV Genres */}
        <h5 className="text-white mb-3 d-flex align-items-center gap-2">
          <FaTv /> TV Genres
        </h5>

        {/* TV Loader Skeleton */}
        {loading ? (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="col">
                <div
                  className="placeholder-wave rounded-3"
                  style={{
                    height: "110px",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <span className="placeholder d-block w-100 h-100 rounded-3"></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {tvGenres.map((genre) => (
              <div
                key={genre.id}
                className="col"
                onClick={() => {
                  navigate(`/genre/tv/${genre.id}`, {
                    state: { genreName: genre.name },
                  });
                  window.scrollTo(0, 0);
                }}
              >
                <Genre_Card
                  icon={genreIcons[genre.name] || <FaTv />}
                  name={genre.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;
