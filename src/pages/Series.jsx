import React from "react";
import Navbar from "../components/Navbar";
import MovieHero from "../components/MovieHero";
import Cast from "../components/Cast";
import { useParams } from "react-router-dom";
import Similar from "../components/Similar";
import Overview from "../components/Overview";
import TVEpisodesSection from "../components/TVEpisodesSection";

const Series = () => {
    const { id } = useParams();
  return (
    <div className="min-vh-100">
      <Navbar />

      <MovieHero id={id} mediaType="tv" />

      <div className="bg-black">
        <Overview id={id} mediaType="tv" />
        <TVEpisodesSection tvId={id} />
        <Cast id={id} mediaType="tv" />
        <Similar id={id} mediaType="tv" />
      </div>
    </div>
  );
};

export default Series;
