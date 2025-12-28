import React from "react";
import { FaPlay } from "react-icons/fa";

const MediaCard = ({ image, title, rating, onClick }) => {
  return (
    <div
      className="position-relative media-card"
      onClick={onClick}
    >
      <div className="position-relative w-100 h-100 media-card-inner">
        <img
          src={
            image
              ? `https://image.tmdb.org/t/p/w500${image}`
              : "/no-image.png"
          }
          alt={title}
          title={title}
          className="w-100 h-100 media-card-image"
        />

        <div className="position-absolute media-card-overlay" />
        <div className="position-absolute media-card-gradient" />

        <div className="position-absolute text-white media-card-content">
          <div className="media-card-title" title={title}>
            {title.length > 15 ? title.substring(0, 15) + "..." : title}
          </div>

          <div className="d-flex align-items-center media-card-rating">
            <span className="star-icon me-1">⭐</span>
            <span className="rating-value">{rating?.toFixed(1)}</span>
          </div>
        </div>

        <div className="position-absolute d-flex align-items-center justify-content-center media-card-play">
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

        .media-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
        }

        .media-card-inner {
          position: relative;
        }

        .media-card-image {
          object-fit: cover;
          transition: transform 0.6s ease, filter 0.4s ease;
        }

        .media-card:hover .media-card-image {
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

        .media-card:hover .media-card-overlay {
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

        .media-card:hover .media-card-gradient {
          height: 60%;
        }

        .media-card-content {
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 4;
          transition: transform 0.4s ease;
        }

        .media-card:hover .media-card-content {
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

        .media-card:hover .media-card-play {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        .media-card-play svg {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
          color: white;
        }

        @media (max-width: 768px) {
          .media-card {
            height: 280px;
            border-radius: 10px;
          }

          .media-card:hover {
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
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .media-card {
            height: 250px;
            border-radius: 8px;
          }

          .media-card-content {
            bottom: 10px;
            left: 10px;
            right: 10px;
          }

          .media-card-title {
            font-size: 0.85rem;
          }

          .media-card-rating {
            font-size: 0.75rem;
          }

          .media-card-play {
            width: 45px;
            height: 45px;
          }

          .media-card-play svg {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default MediaCard;