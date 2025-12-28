import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MediaCard from "../components/MediaCard"; // import our new card
import CardSkeleton from "./CardSkeleton";

const Similar = ({ id, mediaType }) => {
  const { getSimilar } = useAuth();
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchSimilar = async () => {
      if (!id || !mediaType) return;

      const items = await getSimilar(mediaType, id);
      setSimilarItems(items);
      setLoading(false);
    };

    fetchSimilar();
  }, [id, mediaType]);

  if (similarItems.length === 0) return null;

  return (
    <div
      className="p-3 p-md-4 p-lg-5 mx-2 mx-md-4 rounded-4 shadow-lg mt-4 mt-md-3"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="d-flex align-items-center gap-3 mb-3 mb-md-4">
        <div
          className="bg-white rounded-3"
          style={{ width: "5px", height: "40px" }}
        ></div>

        <h3 className="fw-bold text-white mb-0">Similar {mediaType === "movie" ? "Movies" : "TV Shows"}</h3>
      </div>

      <div className="container-fluid">
        {loading ? (
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {similarItems.map((item) => {
              const isPerson = item.media_type === "person";
              const image = isPerson ? item.profile_path : item.poster_path;
              const title = isPerson ? item.name : item.title || item.name;

              return (
                <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  {isPerson ? (
                    // person card - unchanged
                    <div
                      style={{
                        width: "100%",
                        height: "250px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          image
                            ? `https://image.tmdb.org/t/p/w500${image}`
                            : "/no-image.png"
                        }
                        alt={title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <MediaCard
                      image={image}
                      title={title}
                      rating={item.vote_average}
                      onClick={() => {
                        navigate(`/${item.media_type || mediaType}/${item.id}`);
                        window.scrollTo(0, 0);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Similar;
