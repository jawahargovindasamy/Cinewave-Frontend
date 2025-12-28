import React from "react";
import { FaCalendarAlt, FaClock, FaGlobe, FaChartBar, FaInfoCircle } from "react-icons/fa";
import DetailItem from "./DetailItem";

const DetailsSection = ({
  overview,
  releaseDate,
  spokenLanguages,
  runtime,
  episodeRuntime,
  numberOfSeasons,
  numberOfEpisodes,
  mediaType,
}) => {
  const formatDate = (date) => date || "N/A";

  const formatLanguages = (languages) => {
    return languages?.slice(0, 2).map((l) => l.english_name).join(", ") || "N/A";
  };

  const getRuntimeText = () => {
    if (mediaType === "movie") {
      return runtime ? `${runtime} min` : "N/A";
    }
    return episodeRuntime?.length ? `${episodeRuntime[0]} min` : "N/A";
  };

  const getTVInfo = () => {
    if (!numberOfSeasons || !numberOfEpisodes) return "N/A";
    return `${numberOfSeasons} Season${numberOfSeasons !== 1 ? "s" : ""} • ${numberOfEpisodes} Episode${numberOfEpisodes !== 1 ? "s" : ""}`;
  };

  return (
    <>
      {/* Overview Section */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className="rounded-2"
            style={{
              width: "3px",
              height: "20px",
              background: "linear-gradient(180deg, #ffc107 0%, #fd7e14 100%)",
            }}
          ></div>
          <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-1 fs-5">
            <FaInfoCircle className="text-warning fs-6" />
            Overview
          </h5>
        </div>

        <p className="text-white-50 fs-6 mb-0 lh-base">
          {overview || "No overview available."}
        </p>
      </div>

      {/* Details Grid */}
      <div className="row g-2 mb-3">
        <DetailItem
          icon={<FaCalendarAlt className="text-warning fs-6" />}
          label={mediaType === "movie" ? "Release Date" : "First Air Date"}
          value={formatDate(releaseDate)}
        />
        <DetailItem
          icon={<FaGlobe className="text-warning fs-6" />}
          label="Language"
          value={formatLanguages(spokenLanguages)}
        />
        <DetailItem
          icon={mediaType === "tv" ? <FaChartBar className="text-warning fs-6" /> : <FaClock className="text-warning fs-6" />}
          label={mediaType === "tv" ? "TV Info" : "Runtime"}
          value={mediaType === "tv" ? getTVInfo() : getRuntimeText()}
        />
      </div>
    </>
  );
};

export default DetailsSection;