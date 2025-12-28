import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import OverviewSkeleton from "./overview/OverviewSkeleton";
import PosterSection from "./overview/PosterSection";
import TitleSection from "./overview/TitleSection";
import ActionButtons from "./overview/ActionButtons";
import DetailsSection from "./overview/DetailsSection";
import GenresSection from "./overview/GenresSection";

const Overview = ({ id, mediaType }) => {
  const {
    apiCall,
    user,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
  } = useAuth();

  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------------------- TMDB FETCH -------------------------------- */
  useEffect(() => {
    if (!id || !mediaType) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/${mediaType}/${id}`);
        setDetails(data);
      } catch (err) {
        console.error("TMDB fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType, apiCall]);

  /* --------------------------- WATCHLIST DERIVED STATE -------------------------- */
  const watchlistItem = useMemo(() => {
    return watchlist.find(
      (item) =>
        String(item.mediaId) === String(id) && item.mediaType === mediaType
    );
  }, [watchlist, id, mediaType]);

  if (loading || !details) {
    return <OverviewSkeleton />;
  }

  return (
    <div
      className="p-3 mx-4 rounded-3 shadow mb-4"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="row">
        {/* POSTER COLUMN */}
        <div className="col-12 col-md-4 col-lg-3 mb-3">
          <div className="d-flex justify-content-center justify-content-md-start">
            <PosterSection
              posterPath={details.poster_path}
              title={details.title || details.name}
              voteAverage={details.vote_average}
              mediaType={mediaType}
            />
          </div>
        </div>

        {/* CONTENT COLUMN */}
        <div className="col-12 col-md-8 col-lg-9">
          <TitleSection
            title={details.title || details.name}
            tagline={details.tagline}
          />

          <ActionButtons
            isInWatchlist={!!watchlistItem}
            watchlistId={watchlistItem?._id}
            watchlistStatus={watchlistItem?.status}
            onAddToWatchlist={() => {
              if (!user) {
                navigate("/login", {
                  state: {
                    from: `${mediaType}/${id}`,
                    message: "Please login to manage your watchlist",
                  },
                });
                return;
              }
              if (watchlistItem) {
                removeFromWatchlist(watchlistItem._id);
              } else {
                addToWatchlist(Number(id), mediaType, "plan_to_watch");
              }
            }}
            onStatusChange={updateWatchlistStatus}
            mediaId={id}
            mediaType={mediaType}
          />

          <DetailsSection
            overview={details.overview}
            releaseDate={details.release_date || details.first_air_date}
            spokenLanguages={details.spoken_languages}
            runtime={details.runtime}
            episodeRuntime={details.episode_run_time}
            numberOfSeasons={details.number_of_seasons}
            numberOfEpisodes={details.number_of_episodes}
            mediaType={mediaType}
          />

          {details.genres?.length > 0 && (
            <GenresSection genres={details.genres} mediaType={mediaType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
