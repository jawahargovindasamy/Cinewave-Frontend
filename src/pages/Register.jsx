import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaTimes,
  FaUserPlus
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleSignup = () => {
    googleLogin();
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Main Card */}
        <div style={{
          background: "rgba(20, 20, 30, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "3rem 2.5rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ 
              fontSize: "2rem", 
              fontWeight: "700",
              color: "#fff",
              marginBottom: "0.5rem",
              letterSpacing: "-0.5px"
            }}>
              Create Account
            </h1>
            <p style={{ 
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.95rem",
              margin: 0
            }}>
              Sign up to start watching amazing content
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: "rgba(220, 53, 69, 0.15)",
              border: "1px solid rgba(220, 53, 69, 0.3)",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}>
              <FaTimes style={{ color: "#dc3545", flexShrink: 0 }} />
              <span style={{ color: "#fff", fontSize: "0.875rem" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ 
                display: "block",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <FaUser style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.875rem"
                }} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    e.target.style.borderColor = "#dc3545";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ 
                display: "block",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.875rem"
                }} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    e.target.style.borderColor = "#dc3545";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ 
                display: "block",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <FaLock style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.875rem"
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    e.target.style.borderColor = "#dc3545";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.4)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div style={{ 
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.75rem",
                marginTop: "0.5rem"
              }}>
                Must be at least 6 characters
              </div>
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <FaLock style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.875rem"
                }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                    e.target.style.borderColor = "#dc3545";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.4)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                background: loading ? "rgba(220, 53, 69, 0.5)" : "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s ease",
                transform: hovered && !loading ? "translateY(-2px)" : "none",
                boxShadow: hovered && !loading ? "0 10px 30px rgba(220, 53, 69, 0.4)" : "0 4px 15px rgba(220, 53, 69, 0.2)"
              }}
              onMouseEnter={() => !loading && setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaUserPlus style={{ fontSize: "0.875rem" }} />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ 
              position: "relative",
              margin: "2rem 0",
              textAlign: "center"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background: "rgba(255, 255, 255, 0.1)"
              }} />
              <span style={{
                position: "relative",
                background: "rgba(20, 20, 30, 0.95)",
                padding: "0 1rem",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.5px"
              }}>
                OR CONTINUE WITH
              </span>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <FaGoogle />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Login Link */}
          <div style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center"
          }}>
            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.95rem" }}>
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              style={{
                color: "#dc3545",
                fontSize: "0.95rem",
                fontWeight: "600",
                textDecoration: "none",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ff4757"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#dc3545"}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Register;