import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaGoogle,
  FaCalendarAlt,
  FaIdBadge,
  FaLock,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import usePageTitle from "../context/usePageTitle";

const Profile = () => {
  const { user, setUser, logout, backendAPI } = useAuth();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  usePageTitle(user?.name || "Profile");

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  if (!user) return null;

  const isGoogleUser = Boolean(user.googleId);
  const isUnchanged = name === user.name && (!newPassword || isGoogleUser);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isUnchanged) return toast.info("No changes to update");

    if (!isGoogleUser && newPassword && !currentPassword) {
      return toast.error("Current password is required");
    }

    setLoading(true);
    try {
      const payload = { name };
      if (!isGoogleUser && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const { data } = await backendAPI.post("/auth/profile", payload);
      setUser(data.user);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-4 mb-4">
        <Navbar />
      </div>

      <div className="container py-4">
        <h3 className="text-white fw-bold mb-4 text-center text-md-start">
          My Profile
        </h3>

        <div className="row g-4">
          {/* LEFT CARD */}
          <div className="col-12 col-lg-4">
            <div className="card bg-dark text-white h-100 border-secondary">
              <div className="card-body p-3 p-md-4">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#dc3545",
                      fontSize: "32px",
                    }}
                  >
                    <FaUser />
                  </div>
                  <h5 className="fw-bold">{user.name}</h5>
                  <small className="text-muted">
                    {isGoogleUser ? (
                      <>
                        <FaGoogle className="me-1" /> Google User
                      </>
                    ) : (
                      "Local User"
                    )}
                  </small>
                </div>

                <hr className="border-secondary" />

                <ProfileItem
                  icon={<FaEnvelope />}
                  label="Email"
                  value={user.email}
                />
                {isGoogleUser && (
                  <ProfileItem
                    icon={<FaGoogle />}
                    label="Google ID"
                    value={user.googleId}
                  />
                )}
                <ProfileItem
                  icon={<FaIdBadge />}
                  label="User ID"
                  value={user._id}
                />
                <ProfileItem
                  icon={<FaCalendarAlt />}
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString("en-IN")}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="col-12 col-lg-8">
            <div className="card bg-dark text-white h-100 border-secondary">
              <div className="card-body p-3 p-md-4">
                <h5 className="fw-bold mb-3">
                  <FaEdit className="me-2" />
                  Edit Profile
                </h5>

                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label text-secondary">Name</label>
                    <input
                      className="form-control bg-black text-white border-secondary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {!isGoogleUser && (
                    <>
                      <div className="mb-3">
                        <label className="form-label text-secondary">
                          <FaLock className="me-1" /> Current Password
                        </label>
                        <input
                          type="password"
                          className="form-control bg-black text-white border-secondary"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-secondary">
                          <FaLock className="me-1" />
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control bg-black text-white border-secondary"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <button
                    className="btn btn-danger w-100 py-2 fw-bold"
                    disabled={loading || isUnchanged}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>

                <hr className="border-secondary my-4" />

                <button
                  className="btn btn-outline-danger w-100 fw-bold"
                  onClick={logout}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center mb-3">
    <div className="me-3 text-danger fs-5">{icon}</div>
    <div className="overflow-hidden">
      <small className="fw-bolder text-secondary">{label}</small>
      <span className="text-truncate d-block">{value}</span>
    </div>
  </div>
);

export default Profile;
