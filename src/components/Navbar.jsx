import React from "react";
import {
  FaHome,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaUser,
  FaHistory,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assests/Logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-sm fixed-top bg-transparent px-3 w-100">
      <div className="container-fluid">
        {/* Brand */}
        <button
          type="button"
          className="navbar-brand d-flex align-items-center text-white fw-bold fs-3 bg-transparent border-0 p-0"
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
          aria-label="CineWave Home"
        >
          <img src={Logo} alt="CineWave Logo" className="brand-logo me-2" />
          CineWave
        </button>

        {/* Hamburger */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarIcons"
          aria-controls="navbarIcons"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars className="text-white fs-3" />
        </button>

        {/* Navbar Icons */}
        <div className="collapse navbar-collapse" id="navbarIcons">
          <div className="d-flex w-100 justify-content-end align-items-center gap-2 gap-sm-3 mt-2 mt-sm-0">
            {/* Home */}
            <button
              className="btn btn-link text-white text-decoration-none p-2"
              onClick={() => navigate("/")}
              aria-label="Home"
              title="Home"
            >
              <FaHome className="fs-5" />
            </button>

            {/* Search */}
            <button
              className="btn btn-link text-white text-decoration-none p-2"
              onClick={() => navigate("/search")}
              aria-label="Search"
              title="Search"
            >
              <FaSearch className="fs-5" />
            </button>

            {/* Genres */}
            <button
              className="btn btn-link text-white text-decoration-none p-2"
              onClick={() => navigate("/genres")}
              aria-label="Genres"
              title="Genres"
            >
              <BiCategory className="fs-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="dropdown">
              <button
                className="btn p-0 border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="profileDropdown"
                aria-label="Profile menu"
              >
                <FaUserCircle className="text-white fs-4" />
              </button>

              {/* Dropdown Menu - Styled with Bootstrap */}
              <div
                className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-0 bg-dark"
                aria-labelledby="profileDropdown"
                style={{ minWidth: "280px", borderRadius: "14px" }}
              >
                {user ? (
                  <>
                    {/* User info section */}
                    <div className="p-3 border-bottom border-secondary border-opacity-25">
                      <div className="d-flex align-items-center">
                        <div className="bg-secondary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center me-3"
                          style={{ width: "36px", height: "36px" }}>
                          <FaUser className="text-white opacity-75" size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="fw-semibold text-truncate text-white">
                            {user.name || "User"}
                          </div>
                          <div className="small text-secondary text-truncate">
                            {user.email || ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {/* Profile */}
                      <button
                        className="dropdown-item d-flex align-items-center text-white py-2 px-3 mb-1 rounded-pill bg-secondary bg-opacity-10"
                        onClick={() => navigate("/profile")}
                      >
                        <div className="bg-secondary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center me-3"
                          style={{ width: "34px", height: "34px" }}>
                          <FaUser className="opacity-75" />
                        </div>
                        <span>Profile</span>
                      </button>

                      {/* Continue Watching */}
                      <button
                        className="dropdown-item d-flex align-items-center text-white py-2 px-3 mb-1 rounded-pill bg-secondary bg-opacity-10"
                        onClick={() => navigate("/continue-watching")}
                      >
                        <div className="bg-secondary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center me-3"
                          style={{ width: "34px", height: "34px" }}>
                          <FaHistory className="opacity-75" />
                        </div>
                        <span>Continue Watching</span>
                      </button>

                      {/* Watchlist */}
                      <button
                        className="dropdown-item d-flex align-items-center text-white py-2 px-3 mb-1 rounded-pill bg-secondary bg-opacity-10"
                        onClick={() => navigate("/watchlist")}
                      >
                        <div className="bg-secondary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center me-3"
                          style={{ width: "34px", height: "34px" }}>
                          <FaHeart className="opacity-75" />
                        </div>
                        <span>Watchlist</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="p-3 border-top border-secondary border-opacity-25">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
                          onClick={handleLogout}
                        >
                          Logout
                          <FaSignOutAlt />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3">
                    <button
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => navigate("/login")}
                    >
                      <FaUser className="opacity-75" />
                      <span>Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped styles - Only keeping what's not possible with Bootstrap */}
      <style>
        {`
          .brand-logo {
            height: 40px;
            width: 40px;
          }

          /* Responsive logo sizing */
          @media (max-width: 576px) {
            .brand-logo {
              height: 32px;
              width: 32px;
            }
          }

          /* Hamburger menu with backdrop blur */
          .navbar-toggler {
            backdrop-filter: blur(4px);
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: background-color 0.2s ease;
          }

          .navbar-toggler:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }

          /* Center collapsed menu on mobile */
          @media (max-width: 576px) {
            .navbar-collapse > div {
              justify-content: center !important;
              padding: 0.5rem 0;
            }
            
            .navbar-collapse {
              background-color: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(6px);
              margin: 0.5rem -1rem 0 -1rem;
              padding: 0.25rem 1rem;
              border-radius: 12px;
            }
          }

          /* Enhanced touch targets for mobile */
          @media (max-width: 576px) {
            .btn-link {
              padding: 0.75rem !important;
              min-width: 48px;
              min-height: 48px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            
            .dropdown > button {
              min-width: 48px;
              min-height: 48px;
              padding: 0.75rem !important;
            }
          }

          /* Improved dropdown positioning on mobile */
          @media (max-width: 576px) {
            .dropdown-menu {
              position: fixed !important;
              top: auto !important;
              right: 1rem !important;
              left: 1rem !important;
              transform: none !important;
              margin-top: 0.5rem !important;
              max-width: calc(100vw - 2rem);
            }
          }

          /* Custom hover effects for dropdown items */
          .dropdown-item.bg-secondary.bg-opacity-10:hover {
            background-color: rgba(108, 117, 125, 0.25) !important;
          }
          
          /* Active state for touch devices */
          .dropdown-item.bg-secondary.bg-opacity-10:active {
            background-color: rgba(108, 117, 125, 0.35) !important;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;