import React from "react";
import Navbar from "../components/Navbar";
import MovieHero from "../components/MovieHero";
import Cast from "../components/Cast";
import { useParams } from "react-router-dom";
import Similar from "../components/Similar";
import Overview from "../components/Overview";

const Movie = () => {
    const { id } = useParams();

  return (
    <div className="min-vh-100">
      <Navbar />
      <MovieHero id={id} mediaType="movie" />
      <div className="bg-black">
        <Overview id={id} mediaType="movie" />
        <Cast id={id} mediaType="movie" />
        <Similar id={id} mediaType="movie" />
      </div>
    </div>
  );
};

export default Movie;