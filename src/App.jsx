import React, { Suspense, lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Genres = lazy(() => import("./pages/Genres"));
const Movie = lazy(() => import("./pages/Movie"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer"));
const Series = lazy(() => import("./pages/Series"));
const MovieGenrePage = lazy(() => import("./pages/MovieGenrePage"));
const TVGenrePage = lazy(() => import("./pages/TVGenrePage"));
const Person = lazy(() => import("./pages/Person"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const ContinueWatching = lazy(() => import("./components/ContinueWatching"));
const Profile = lazy(() => import("./pages/Profile"));

const AppWrapper = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/movie/:id/play" element={<VideoPlayer />} />
            <Route
              path="/tv/:id/season/:season/episode/:episode/play"
              element={<VideoPlayer />}
            />
            <Route path="/tv/:id" element={<Series />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genre/movie/:id" element={<MovieGenrePage />} />
            <Route path="/genre/tv/:id" element={<TVGenrePage />} />
            <Route path="/person/:id" element={<Person />} />
            {user && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/continue-watching" element={<ContinueWatching />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </>
            )}
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
