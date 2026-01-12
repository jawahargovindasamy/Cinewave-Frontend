import React from "react";
import { FaPlay } from "react-icons/fa";
import LazyImage from "./LazyImage";

const MediaCard = ({ image, title, rating, onClick }) => {
  const imageUrl = image
    ? `https://image.tmdb.org/t/p/w500${image}`
    : "/no-image.png";

  return (
    <div
      className="position-relative media-card"
      onClick={onClick}
      data-testid="media-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${title}`}
    >
      <div className="position-relative w-100 h-100 media-card-inner">
        <LazyImage
          src={imageUrl}
          alt={title}
          title={title}
          className="w-100 h-100 media-card-image"
          placeholder="/no-image.png"
        />

        <div className="position-absolute media-card-overlay" />
        <div className="position-absolute media-card-gradient" />

        <div className="position-absolute text-white media-card-content">
          <div className="media-card-title" title={title} data-testid="media-card-title">
            {title.length > 15 ? title.substring(0, 15) + "..." : title}
          </div>

          <div className="d-flex align-items-center media-card-rating" data-testid="media-card-rating">
            <span className="star-icon me-1" aria-hidden="true">⭐</span>
            <span className="rating-value">{rating?.toFixed(1)}</span>
          </div>
        </div>

        <div className="position-absolute d-flex align-items-center justify-content-center media-card-play" aria-hidden="true">
          <FaPlay size={24} />
        </div>
      </div>

      <style>{`
        .media-card {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .media-card:hover,
        .media-card:focus {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
          outline: none;
        }

        .media-card:focus-visible {
          outline: 2px solid #e50914;
          outline-offset: 2px;
        }

        .media-card-inner {
          position: relative;
        }

        .media-card-image {
          object-fit: cover;
          transition: transform 0.6s ease, filter 0.4s ease;
        }

        .media-card:hover .media-card-image,
        .media-card:focus .media-card-image {
          transform: scale(1.1);
          filter: brightness(0.7);
        }

        .media-card-overlay {
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 2;
        }

        .media-card:hover .media-card-overlay,
        .media-card:focus .media-card-overlay {
          opacity: 1;
        }

        .media-card-gradient {
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent);
          z-index: 3;
          transition: height 0.4s ease;
        }

        .media-card:hover .media-card-gradient,
        .media-card:focus .media-card-gradient {
          height: 60%;
        }

        .media-card-content {
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 4;
          transition: transform 0.4s ease;
        }

        .media-card:hover .media-card-content,
        .media-card:focus .media-card-content {
          transform: translateY(-5px);
        }

        .media-card-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 6px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
          letter-spacing: 0.3px;
        }

        .media-card-rating {
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.95;
        }

        .star-icon {
          font-size: 0.9rem;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
        }

        .rating-value {
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        }

        .media-card-play {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          z-index: 5;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .media-card:hover .media-card-play,
        .media-card:focus .media-card-play {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        .media-card-play svg {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
          color: white;
        }

        /* Mobile Responsive Improvements */
        @media (max-width: 768px) {
          .media-card {
            height: 260px;
            border-radius: 10px;
          }

          .media-card:hover,
          .media-card:focus {
            transform: translateY(-4px) scale(1.02);
          }

          .media-card-title {
            font-size: 0.9rem;
          }

          .media-card-rating {
            font-size: 0.8rem;
          }

          .media-card-play {
            width: 50px;
            height: 50px;
          }

          .media-card-play svg {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .media-card {
            height: 220px;
            border-radius: 8px;
          }

          .media-card-content {
            bottom: 8px;
            left: 8px;
            right: 8px;
          }

          .media-card-title {
            font-size: 0.85rem;
            margin-bottom: 4px;
          }

          .media-card-rating {
            font-size: 0.75rem;
          }

          .media-card-play {
            width: 45px;
            height: 45px;
          }

          .media-card-play svg {
            font-size: 18px;
          }
        }

        /* Extra small devices */
        @media (max-width: 360px) {
          .media-card {
            height: 200px;
          }

          .media-card-title {
            font-size: 0.8rem;
          }

          .media-card-rating {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MediaCard;