import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Genres from "./pages/Genres";
import Movie from "./pages/Movie";
import VideoPlayer from "./components/VideoPlayer";
import Series from "./pages/Series";
import MovieGenrePage from "./pages/MovieGenrePage";
import TVGenrePage from "./pages/TVGenrePage";
import Person from "./pages/Person";
import Watchlist from "./pages/Watchlist";
import { useAuth } from "./context/AuthContext";
import ContinueWatching from "./components/ContinueWatching";

const AppWrapper = () => {
  const { user } = useAuth();

  return (
    <>
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
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/continue-watching" element={<ContinueWatching/>}/>
          </>
        )}
      </Routes>
    </>
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
