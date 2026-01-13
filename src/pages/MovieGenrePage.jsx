import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MediaCard from "../components/MediaCard";
import Pagination from "../components/Pagination";
import CardSkeleton from "../components/CardSkeleton";
import usePageTitle from "../context/usePageTitle";

const MovieGenrePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { apiCall } = useAuth();
  const navigate = useNavigate();

  const [genreName] = useState(location.state?.genreName || "");

  usePageTitle(genreName ? `${genreName} Movies` : "Movies");


  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (pageNumber = 1) => {
    setLoading(true);
    const data = await apiCall(
      `/discover/movie?with_genres=${id}&page=${pageNumber}`
    );
    setMovies(data.results || []);
    setTotalPages(data.total_pages || 1);
    setLoading(false);
  };

  // Fetch movies whenever id or page changes
  useEffect(() => {
    fetchMovies(page);
  }, [id, page]);
  

  // Function to handle page changes with clean URL for page 1
  const handlePageChange = (newPage) => {
    if (newPage === 1) {
      // Remove page parameter when going to page 1
      searchParams.delete("page");
      setSearchParams(searchParams);
    } else {
      searchParams.set("page", newPage);
      setSearchParams(searchParams);
    }
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-4">
        <Navbar />
      </div>

      <div className="px-4 py-4 mt-5 mt-md-4">
        <h3 className="text-white fw-bold mb-4">
          {genreName ? `${genreName} Movies` : "Movies"}
        </h3>

        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 mb-4">
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="col">
                  <CardSkeleton />
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="col"
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <MediaCard
                    image={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/no-image.png"
                    }
                    title={movie.title}
                    rating={movie.vote_average}
                  />
                </div>
              ))}
        </div>

        {!loading && movies.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default MovieGenrePage;
