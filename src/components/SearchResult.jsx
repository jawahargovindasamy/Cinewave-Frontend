import React from "react";
import { useNavigate } from "react-router-dom";
import MediaCard from "./MediaCard";

const SearchResult = ({ Result, searchTerm, totalCount }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-5 px-4 pb-5">
      <h3 className="text-white fs-4 fw-bold mb-3">{searchTerm}</h3>

      <p className="text-white opacity-50 mb-3">
        {`${totalCount || Result.length} results`}
      </p>

      <div className="container-fluid">
        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {Result.map((item, index) => {
            const isPerson =
              item.media_type === "person" || item.profile_path ? true : false;

            const title = item.title || item.name;
            const image = isPerson ? item.profile_path : item.poster_path;

            // Determine type for navigation
            let type = "";
            if (item.media_type) type = item.media_type;
            else if (item.profile_path) type = "person";
            else if (item.title) type = "movie";
            else if (item.name) type = "tv";

            return (
              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
                {!isPerson ? (
                  /* ------------------------------
                     MOVIE / TV CARD -> MediaCard
                  ------------------------------ */
                  <MediaCard
                    image={image}
                    title={title}
                    rating={item.vote_average}
                    onClick={() => {
                      navigate(`/${type}/${item.id}`);
                      window.scrollTo(0, 0);
                    }}
                  />
                ) : (
                  /* ------------------------------
                     PERSON CARD
                  ------------------------------ */
                  <div
                    className="position-relative"
                    style={{
                      width: "100%",
                      height: "250px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => navigate(`/person/${item.id}`)}
                  >
                    <img
                      src={
                        image
                          ? `https://image.tmdb.org/t/p/w500${image}`
                          : "/no-image.png"
                      }
                      alt={title}
                      title={title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      className="position-absolute text-white text-center w-100"
                      style={{
                        bottom: "10px",
                        zIndex: 10,
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {title.length > 20
                        ? title.substring(0, 20) + "..."
                        : title}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
