import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import MediaCard from "../components/MediaCard";
import CardSkeleton from "../components/CardSkeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePageTitle from "../context/usePageTitle";

const Watchlist = () => {
  const { 
    user,
    watchlistLoading, 
    loadWatchlist 
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  
  // Get filter values from URL params
  const statusParam = searchParams.get("status") || "";
  const mediaTypeParam = searchParams.get("mediaType") || "";

  usePageTitle("Watchlist");

  // Load watchlist when user or URL params change
  useEffect(() => {
    if (user) {
      const loadItems = async () => {
        try {
          const filters = {};
          if (statusParam) filters.status = statusParam;
          if (mediaTypeParam) filters.mediaType = mediaTypeParam;
          
          const data = await loadWatchlist(filters);
          setItems(data || []);
        } catch (error) {
          console.error("Failed to load watchlist:", error);
          setItems([]);
        }
      };
      
      loadItems();
    }
  }, [user, statusParam, mediaTypeParam]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    updateParams("status", value);
  };

  const handleMediaTypeChange = (e) => {
    const value = e.target.value;
    updateParams("mediaType", value);
  };

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Update URL without replace
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    // Clear all filter params
    setSearchParams(new URLSearchParams());
  };

  // Check if any filter is active
  const hasActiveFilters = statusParam || mediaTypeParam;

  if (!user) {
    return (
      <div className="bg-black min-vh-100">
        <div className="pb-4">
          <Navbar />
        </div>
        <div className="px-4 py-4 mt-5 mt-md-4">
          <h5 className="text-white">Please login to view your watchlist</h5>
        </div>
      </div>
    );
  }

  

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-4">
        <Navbar />
      </div>

      <div className="px-4 py-4 mt-5 mt-md-4">
        <h1 className="text-white fw-bold mb-4">My Watchlist</h1>

        {/* Filters section */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-4 align-items-start align-items-md-center">
          <div className="text-white fw-medium">Filters:</div>
          
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <select
              className="form-select w-auto bg-dark text-white border-secondary"
              style={{ minWidth: "160px" }}
              value={statusParam}
              onChange={handleStatusChange}
            >
              <option value="">All Status</option>
              <option value="plan_to_watch">Plan to Watch</option>
              <option value="watching">Watching</option>
              <option value="on_hold">On Hold</option>
              <option value="dropped">Dropped</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="form-select w-auto bg-dark text-white border-secondary"
              style={{ minWidth: "140px" }}
              value={mediaTypeParam}
              onChange={handleMediaTypeChange}
            >
              <option value="">All Media</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

            {hasActiveFilters && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
                style={{ whiteSpace: "nowrap" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Display active filters */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {statusParam && (
              <span className="badge bg-primary">
                Status: {statusParam.replace('_', ' ')}
                <button 
                  className="btn-close btn-close-white ms-2" 
                  style={{fontSize: '0.5rem'}}
                  onClick={() => updateParams("status", "")}
                  aria-label="Remove status filter"
                ></button>
              </span>
            )}
            {mediaTypeParam && (
              <span className="badge bg-info text-dark">
                Type: {mediaTypeParam === 'movie' ? 'Movies' : 'TV Shows'}
                <button 
                  className="btn-close ms-2" 
                  style={{fontSize: '0.5rem'}}
                  onClick={() => updateParams("mediaType", "")}
                  aria-label="Remove media type filter"
                ></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        {!watchlistLoading && items.length > 0 && (
          <div className="text-white mb-3">
            Showing {items.length} item{items.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' with selected filters'}
          </div>
        )}

        {/* Movie grid */}
        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 mb-4">
          {watchlistLoading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="col">
                  <CardSkeleton />
                </div>
              ))
            : items.map((item) => (
                <div
                  key={item._id}
                  className="col"
                  onClick={() => {
                    navigate(`/${item.mediaType}/${item.mediaId}`);
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <MediaCard
                    image={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/no-image.png"
                    }
                    title={item.title}
                    rating={item.vote_average}
                    subtitle={
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className={`badge ${
                          item.status === 'completed' ? 'bg-success' :
                          item.status === 'watching' ? 'bg-primary' :
                          item.status === 'plan_to_watch' ? 'bg-warning text-dark' :
                          item.status === 'on_hold' ? 'bg-info text-dark' :
                          'bg-secondary'
                        } badge-sm`}>
                          {item.status?.replace('_', ' ') || 'N/A'}
                        </span>
                        <span className="badge bg-dark text-light badge-sm">
                          {item.mediaType === 'movie' ? 'Movie' : 'TV'}
                        </span>
                      </div>
                    }
                  />
                </div>
              ))}
        </div>

        {!watchlistLoading && items.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">
              {hasActiveFilters 
                ? "No items found with the selected filters." 
                : "No items in your watchlist."}
            </p>
            {hasActiveFilters ? (
              <button 
                className="btn btn-outline-light mt-3"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            ) : (
              <button 
                className="btn btn-outline-light mt-3"
                onClick={() => navigate("/")}
              >
                Browse Movies & TV Shows
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;