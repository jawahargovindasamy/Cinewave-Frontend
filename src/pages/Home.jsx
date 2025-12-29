import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MovieCarousel from "../components/MovieCarousel";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ContinueWatching from "../components/ContinueWatching";

const Home = () => {
  const { loadMovies, trending, topRated, tv, upcoming } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <>
      <Navbar />
      <Hero trendingMovies={trending} />

      <div style={{ background: "black", paddingBottom: "60px" }}>
        <MovieCarousel title="Trending Now" movies={trending} />

        {/* Continue Watching (Horizontal here) */}
        <ContinueWatching />

        <MovieCarousel title="Top Rated" movies={topRated} />
        <MovieCarousel title="TV Originals" movies={tv} />
        <MovieCarousel title="Upcoming Movies" movies={upcoming} />
      </div>
    </>
  );
};

export default Home;
