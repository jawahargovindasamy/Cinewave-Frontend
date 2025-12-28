import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Carousel from "react-bootstrap/Carousel";
import MediaCard from "./MediaCard";
import { useNavigate } from "react-router-dom";

const MovieCarousel = ({ title, movies = [] }) => {
  const [cardsPerSlide, setCardsPerSlide] = useState(5);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Responsive cards-per-slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) setCardsPerSlide(3);
      else if (window.innerWidth <= 768) setCardsPerSlide(4);
      else if (window.innerWidth <= 992) setCardsPerSlide(5);
      else setCardsPerSlide(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading state
  useEffect(() => {
    setLoading(movies.length === 0);
  }, [movies]);

  // Slice movies into slides
  const slides = [];
  for (let i = 0; i < movies.length; i += cardsPerSlide) {
    slides.push(movies.slice(i, i + cardsPerSlide));
  }

  const handleCardClick = (movie) => {
    const type = movie.media_type || (movie.title ? "movie" : "tv");
    navigate(`/${type}/${movie.id}`);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const LoadingSlide = () => (
    <div className="d-flex gap-3">
      {Array.from({ length: cardsPerSlide }).map((_, idx) => (
        <div
          key={idx}
          style={{
            flex: "1 0 auto",
            height: "300px",
            borderRadius: "10px",
            background: "#333",
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-white">{title}</h2>
        </div>
        <LoadingSlide />
      </div>
    );
  }

  return (
    <div className="mb-5 px-2 px-md-3 px-lg-4">
      {/* Title + Arrows */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-white rounded-3"
            style={{ width: "5px", height: "40px" }}
          ></div>

          <h3 className="fw-bold text-white mb-0">
            {title}
          </h3>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-md d-flex align-items-center justify-content-center "
            onClick={handlePrev}
            disabled={slides.length <= 1}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            className="btn btn-outline-light btn-md d-flex align-items-center justify-content-center"
            onClick={handleNext}
            disabled={slides.length <= 1}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        controls={false}
        indicators={false}
        interval={null}
      >
        {slides.map((group, i) => (
          <Carousel.Item key={i}>
            <div className="d-flex gap-3 px-1 px-md-2">
              {group.map((movie) => (
                <div key={movie.id} style={{ flex: "1 0 auto" }}>
                  <MediaCard
                    image={movie.poster_path || movie.profile_path}
                    title={movie.title || movie.name}
                    rating={movie.vote_average || 0}
                    onClick={() => handleCardClick(movie)}
                  />
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
