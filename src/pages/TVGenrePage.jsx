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

const TVGenrePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { apiCall } = useAuth();
  const navigate = useNavigate();

  const genreName = location.state?.genreName || "";

  const [tv, setTV] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;
  const [totalPages, setTotalPages] = useState(1);

  const fetchTV = async (pageNumber = 1) => {
    setLoading(true);
    const data = await apiCall(
      `/discover/tv?with_genres=${id}&page=${pageNumber}`
    );
    setTV(data.results || []);
    setTotalPages(data.total_pages || 1);
    setLoading(false);
  };

  // Fetch TV shows whenever id or page changes
  useEffect(() => {
    fetchTV(page);
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
          {genreName ? `${genreName} TV Shows` : "TV Shows"}
        </h3>

        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 mb-4">
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="col">
                  <CardSkeleton />
                </div>
              ))
            : tv.map((show) => (
                <div
                  key={show.id}
                  className="col"
                  onClick={() => {
                    navigate(`/tv/${show.id}`);
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <MediaCard
                    image={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                        : "/no-image.png"
                    }
                    title={show.name}
                    rating={show.vote_average}
                  />
                </div>
              ))}
        </div>

        {!loading && tv.length > 0 && (
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

export default TVGenrePage;