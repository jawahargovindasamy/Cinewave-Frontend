import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
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
    user ? loadWatchlist() : setWatchlist([]);
    user ? loadContinueWatching() : setContinueWatching([]);
  }, [user]);

  const checkLoggedIn = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await backendAPI.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch {
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

      const { data } = await backendAPI.get("/watchlist", {
        params: filters,
      });

      const enriched = await Promise.all(
        data.map(async (item) => {
          try {
            const tmdb = await apiCall(`/${item.mediaType}/${item.mediaId}`);
            return {
              ...item,
              poster_path: tmdb.poster_path,
              title: tmdb.title || tmdb.name,
              vote_average: tmdb.vote_average,
              overview: tmdb.overview,
              release_date: tmdb.release_date || tmdb.first_air_date,
            };
          } catch {
            return item;
          }
        })
      );

      setWatchlist(enriched);
      return enriched;
    } finally {
      setWatchlistLoading(false);
    }
  };

  const addToWatchlist = async (
    mediaId,
    mediaType,
    status = "plan_to_watch"
  ) => {
    const { data: newItem } = await backendAPI.post("/watchlist", {
      mediaId,
      mediaType,
      status,
    });

    const tmdb = await apiCall(`/${mediaType}/${mediaId}`);

    const enrichedItem = {
      ...newItem,
      poster_path: tmdb.poster_path,
      title: tmdb.title || tmdb.name,
      vote_average: tmdb.vote_average,
      overview: tmdb.overview,
      release_date: tmdb.release_date || tmdb.first_air_date,
    };

    setWatchlist((prev) => [enrichedItem, ...prev]);
    return enrichedItem;
  };

  const updateWatchlistStatus = async (watchlistId, status) => {
    const { data } = await backendAPI.put(`/watchlist/${watchlistId}`, {
      status,
    });

    setWatchlist((prev) =>
      prev.map((item) =>
        item._id === watchlistId ? { ...item, ...data } : item
      )
    );
    return data;
  };

  const removeFromWatchlist = async (watchlistId) => {
    await backendAPI.delete(`/watchlist/${watchlistId}`);
    setWatchlist((prev) => prev.filter((item) => item._id !== watchlistId));
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

      const { data } = await backendAPI.get("/continue-watching");

      const enriched = await Promise.all(
        data.map(async (item) => {
          const tmdb = await apiCall(`/${item.mediaType}/${item.mediaId}`);
          return {
            ...item,
            poster_path: tmdb.backdrop_path,
            title: tmdb.title || tmdb.name,
            vote_average: tmdb.vote_average,
            overview: tmdb.overview,
            release_date: tmdb.release_date || tmdb.first_air_date,
          };
        })
      );

      enriched.sort(
        (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
      );

      setContinueWatching(enriched);
    } finally {
      setContinueWatchingLoading(false);
    }
  };

  const removeContinueWatching = async (payload) => {
    await backendAPI.delete("/continue-watching", {
      data: payload,
    });

    setContinueWatching((prev) =>
      prev.filter(
        (item) =>
          !(
            item.mediaType === payload.mediaType &&
            item.mediaId === payload.mediaId &&
            item.seasonNumber === payload.seasonNumber &&
            item.episodeNumber === payload.episodeNumber
          )
      )
    );
  };

  const login = async (email, password) => {
    try {
      const { data } = await backendAPI.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await backendAPI.post(
        "/auth/register",
        { name, email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWatchlist([]);
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
