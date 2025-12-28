import React from "react";

const TitleSection = ({ title, tagline }) => {
  return (
    <div className="mb-3">
      <h2 className="text-white fw-bold mb-1 fs-4">{title}</h2>
      {tagline && (
        <p className="text-warning fs-6 fst-italic mb-0 opacity-75">
          "{tagline}"
        </p>
      )}
    </div>
  );
};

export default TitleSection;