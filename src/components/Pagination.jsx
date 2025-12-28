import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <nav aria-label="Movie pagination" className="py-4">
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-dark text-light me-3 px-4 py-2 d-flex align-items-center"
          disabled={currentPage === 1}
          onClick={onPrev}
          style={{
            borderRadius: "30px",
            minWidth: "100px",
            transition: "all 0.2s ease",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
          onMouseOver={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = "#343a40";
              e.target.style.transform = "translateX(-3px)";
            }
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "";
            e.target.style.transform = "";
          }}
        >
          <i className="bi bi-chevron-left me-2"></i> Prev
        </button>

        <div className="page-indicator position-relative px-4">
          <span className="current-page text-white fs-5 fw-bold">{currentPage}</span>
          <span className="text-white-50 mx-2">/</span>
          <span className="total-pages text-white-50">{totalPages}</span>
        </div>

        <button
          className="btn btn-dark text-light ms-3 px-4 py-2 d-flex align-items-center"
          disabled={currentPage === totalPages}
          onClick={onNext}
          style={{
            borderRadius: "30px",
            minWidth: "100px",
            transition: "all 0.2s ease",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
          onMouseOver={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = "#343a40";
              e.target.style.transform = "translateX(3px)";
            }
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "";
            e.target.style.transform = "";
          }}
        >
          Next <i className="bi bi-chevron-right ms-2"></i>
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
