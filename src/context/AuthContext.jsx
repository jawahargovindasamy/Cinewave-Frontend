import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const TMDB_KEY = "71c08a91c58d917b27e9bff6913900de";
  const TMDB_URL = "https://api.themoviedb.org/3";
  const VIDURL = "https://vidsrcme.ru/embed";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tv, setTV] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchFilter, setSearchFilter] = useState("all");
  const [muted, setMuted] = useState(true);

  // New state for watchlist
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // New state for continue watching
  const [continueWatching, setContinueWatching] = useState([]);
  const [continueWatchingLoading, setContinueWatchingLoading] = useState(false);

  const token = localStorage.getItem("token");

  const backendAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  backendAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  });

  const passwordAPI = {
    forgotPassword: (email) => backendAPI.post("/password/forgot", { email }),
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  // Load watchlist when user changes
  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadContinueWatching();
    } else {
      setContinueWatching([]);
    }
  }, [user]);

  const checkLoggedIn = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Token invalid");

      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Watchlist methods
  const loadWatchlist = async (filters = {}) => {
    if (!user) return;

    try {
      setWatchlistLoading(true);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.mediaType) params.append("mediaType", filters.mediaType);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/watchlist?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch watchlist");

      const watchlistData = await res.json();

      // Enrich with TMDB data
      const enriched = await Promise.all(
        watchlistData.map(async (item) => {
          try {
            const data = await apiCall(`/${item.mediaType}/${item.mediaId}`);
            return {
              ...item,
              poster_path: data.poster_path,
              title: data.title || data.name,
              vote_average: data.vote_average,
              overview: data.overview,
              release_date: data.release_date || data.first_air_date,
            };
          } catch (error) {
            console.error(
              `Failed to fetch TMDB data for ${item.mediaType} ${item.mediaId}:`,
              error
            );
            return item; // Return original item if TMDB fetch fails
          }
        })
      );

      setWatchlist(enriched);
      return enriched;
    } catch (error) {
      console.error("Watchlist load error:", error);
      throw error;
    } finally {
      setWatchlistLoading(false);
    }
  };

  const addToWatchlist = async (
    mediaId,
    mediaType,
    status = "plan_to_watch"
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId,
          mediaType,
          status,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add to watchlist");
      }

      const newItem = await res.json();

      // Fetch TMDB data for the new item
      const tmdbData = await apiCall(`/${mediaType}/${mediaId}`);

      const enrichedItem = {
        ...newItem,
        poster_path: tmdbData.poster_path,
        title: tmdbData.title || tmdbData.name,
        vote_average: tmdbData.vote_average,
        overview: tmdbData.overview,
        release_date: tmdbData.release_date || tmdbData.first_air_date,
      };

      // Update local watchlist state
      setWatchlist((prev) => [enrichedItem, ...prev]);

      return enrichedItem;
    } catch (error) {
      console.error("Add to watchlist error:", error);
      throw error;
    }
  };

  const updateWatchlistStatus = async (watchlistId, status) => {
    if (!user) throw new Error("User must be logged in");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/watchlist/${watchlistId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update watchlist");
      }

      const updatedItem = await res.json();

      // Update local watchlist state
      setWatchlist((prev) =>
        prev.map((item) =>
          item._id === watchlistId ? { ...item, ...updatedItem } : item
        )
      );

      return updatedItem;
    } catch (error) {
      console.error("Update watchlist error:", error);
      throw error;
    }
  };

  const removeFromWatchlist = async (watchlistId) => {
    if (!user) throw new Error("User must be logged in");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/watchlist/${watchlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to remove from watchlist");
      }

      // Update local watchlist state
      setWatchlist((prev) => prev.filter((item) => item._id !== watchlistId));

      return true;
    } catch (error) {
      console.error("Remove from watchlist error:", error);
      throw error;
    }
  };

  const checkInWatchlist = (mediaId, mediaType) => {
    return watchlist.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType
    );
  };

  const loadContinueWatching = async () => {
    if (!user) return;

    try {
      setContinueWatchingLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/continue-watching`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch continue watching");

      const continueWatchingData = await res.json();

      const enriched = await Promise.all(
        continueWatchingData.map(async (item) => {
          const data = await apiCall(`/${item.mediaType}/${item.mediaId}`);
          return {
            ...item,
            poster_path: data.backdrop_path,
            title: data.title || data.name,
            vote_average: data.vote_average,
            overview: data.overview,
            release_date: data.release_date || data.first_air_date,
          };
        })
      );

      // Sort latest watched first
      enriched.sort(
        (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
      );

      setContinueWatching(enriched);
      return enriched;
    } catch (error) {
      console.error("Continue watching load error:", error);
      throw error;
    } finally {
      setContinueWatchingLoading(false);
    }
  };

  const removeContinueWatching = async ({
    mediaType,
    mediaId,
    seasonNumber = null,
    episodeNumber = null,
  }) => {
    if (!user) throw new Error("User must be logged in");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/continue-watching`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mediaType,
            mediaId,
            seasonNumber,
            episodeNumber,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || "Failed to remove from continue watching"
        );
      }

      // Update local state
      setContinueWatching((prev) =>
        prev.filter(
          (item) =>
            !(
              item.mediaType === mediaType &&
              item.mediaId === mediaId &&
              item.seasonNumber === seasonNumber &&
              item.episodeNumber === episodeNumber
            )
        )
      );

      return true;
    } catch (error) {
      console.error("Remove from continue watching error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWatchlist([]); // Clear watchlist on logout
    window.location.href = "/";
  };

  const googleLogin = () => {
    const baseURL =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    window.location.href = `${baseURL}/api/auth/google`;
  };

  const axiosTMDB = axios.create({
    baseURL: TMDB_URL,
    params: {
      api_key: TMDB_KEY,
    },
  });

  const apiCall = async (endpoint, extraParams = {}) => {
    const res = await axiosTMDB.get(endpoint, { params: extraParams });
    return res.data;
  };

  const loadMovies = async () => {
    setTrending((await apiCall("/trending/all/week")).results);
    setTopRated((await apiCall("/movie/top_rated")).results);
    setTV((await apiCall("/discover/tv")).results);
    setUpcoming((await apiCall("/movie/upcoming")).results);
  };

  const getSimilar = async (mediaType, id) => {
    const data = await apiCall(`/${mediaType}/${id}/similar`);
    return data.results || [];
  };

  const value = {
    user,
    setUser,
    token,
    login,
    register,
    logout,
    passwordAPI,
    googleLogin,
    loading,
    VIDURL,
    apiCall,
    backendAPI,
    loadMovies,
    trending,
    topRated,
    tv,
    upcoming,
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    searchPage,
    setSearchPage,
    searchTotalPages,
    setSearchTotalPages,
    totalCount,
    setTotalCount,
    searchFilter,
    setSearchFilter,
    getSimilar,
    muted,
    setMuted,
    watchlist,
    watchlistLoading,
    continueWatching,
    continueWatchingLoading,
    loadWatchlist,
    loadContinueWatching,
    addToWatchlist,
    updateWatchlistStatus,
    removeFromWatchlist,
    removeContinueWatching,
    checkInWatchlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
