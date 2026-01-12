import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import Pagination from "../components/Pagination";
import CardSkeleton from "../components/CardSkeleton";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const {
    loadMovies,
    trending,
    apiCall,
    searchResults,
    setSearchResults,
    searchPage,
    setSearchPage,
    searchTotalPages,
    setSearchTotalPages,
    totalCount,
    setTotalCount,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // SOURCE OF TRUTH = URL
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "all";

  useEffect(() => {
    loadMovies();
    setLoading(false);
  }, []);

  const loadResult = async () => {
    if (!query) {
      setSearchResults([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);

    let endpoint = "/search/multi";
    if (type === "movie") endpoint = "/search/movie";
    if (type === "tv") endpoint = "/search/tv";
    if (type === "person") endpoint = "/search/person";

    const res = await apiCall(endpoint, {
      query,
      page,
    });

    setSearchResults(res.results || []);
    setSearchTotalPages(res.total_pages || 1);
    setTotalCount(res.total_results || 0);
    setSearchPage(page);

    setLoading(false);
  };

  // SEARCH RUNS ONLY WHEN URL CHANGES
  useEffect(() => {
    loadResult();
  }, [query, type, page]);

  return (
    <div className="bg-black min-vh-100" data-testid="search-page">
      <div className="pb-5">
        <Navbar />
      </div>

      <SearchBar />

      {!query && (
        <SearchResult Result={trending} searchTerm="Trending Now" />
      )}

      {loading ? (
        <div className="container mt-5" data-testid="search-loading">
          <h3 className="text-white fs-4 fw-bold mb-4">{query}</h3>
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        </div>
      ) : (
        query && (
          <div data-testid="search-results">
            <SearchResult
              Result={searchResults}
              searchTerm={query}
              totalCount={totalCount}
            />

            {searchResults.length > 0 && (
              <Pagination
                currentPage={searchPage}
                totalPages={searchTotalPages}
                onPrev={() => {
                  setSearchParams({ q: query, type, page: page - 1 });
                  window.scrollTo(0, 0);
                }}
                onNext={() => {
                  setSearchParams({ q: query, type, page: page + 1 });
                  window.scrollTo(0, 0);
                }}
              />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Search;
