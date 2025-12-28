import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, searchFilter, setSearchFilter } =
    useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Restore input & filter from URL on refresh
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    setSearchTerm(q);
    setSearchFilter(type);
    // eslint-disable-next-line
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const params = {};
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (searchFilter !== "all") params.type = searchFilter;
      params.page = 1;
      setSearchParams(params);
    }
  };

  const handleSelect = (value) => {
    setSearchFilter(value);
    setShowDropdown(false);

    const params = {};
    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (value !== "all") params.type = value;
    params.page = 1;
    setSearchParams(params);
  };

  return (
    <div className="mt-5 w-100 d-flex justify-content-center position-relative">
      <div className="position-relative" style={{ width: "80%" }}>
        <input
          type="text"
          value={searchTerm}
          className="bg-transparent text-white py-2 px-5 w-100"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Movies, TV Series and more"
          style={{
            border: "2px solid white",
            borderRadius: "40px",
            outline: "none",
            fontSize: "1rem",
            transition: "0.3s ease",
          }}
        />

        <FaSearch
          className="position-absolute text-white"
          style={{
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {searchTerm && (
          <FaTimes
            className="position-absolute text-white"
            style={{
              top: "50%",
              right: "60px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => {
              setSearchTerm("");
              setSearchFilter("all");
              setSearchParams({});
            }}
          />
        )}

        <FaFilter
          className="position-absolute text-white"
          style={{
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: "10px",
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid white",
              borderRadius: "10px",
              padding: "10px",
              minWidth: "150px",
              zIndex: 100,
            }}
          >
            {["all", "movie", "tv", "person"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "8px",
                  color: searchFilter === item ? "yellow" : "white",
                  cursor: "pointer",
                }}
                onClick={() => handleSelect(item)}
              >
                {item === "tv"
                  ? "TV Series"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
