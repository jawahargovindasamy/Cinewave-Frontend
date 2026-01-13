import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import usePageTitle from '../context/usePageTitle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { passwordAPI } = useAuth();

  usePageTitle("Forgot Password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await passwordAPI.forgotPassword(email);
      toast.success(response.data.message || 'Password reset email sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
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
      <div style={{ width: "100%", maxWidth: "480px" }}>
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
              Forgot Password?
            </h1>
            <p style={{ 
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.95rem",
              margin: 0
            }}>
              Enter your email and we'll send you a new password
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: "1rem" }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
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
              <div style={{ 
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.75rem",
                marginTop: "0.5rem"
              }}>
                We'll send a new password to your email
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                marginTop: "1.5rem",
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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane style={{ fontSize: "0.875rem" }} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login Link */}
        <div style={{ 
          marginTop: "1.5rem",
          textAlign: "center"
        }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.95rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dc3545";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <FaArrowLeft style={{ fontSize: "0.875rem" }} />
            <span>Back to Login</span>
          </Link>
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

export default ForgotPassword;