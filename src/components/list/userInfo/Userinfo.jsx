import { useState } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const Userinfo = () => {
  const { currentUser, logout } = useUserStore();
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangePasswordFormOpen, setIsChangePasswordFormOpen] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] =
    useState(false);

  const suggestedStatuses = [
    { text: "🍔 Out for lunch" },
    { text: "💼 In meetings" },
    { text: "🎓 At school" },
    { text: "🎬 At the movies" },
    { text: "✈️ Travelling" },
    { text: "🎉 Celebrating" },
    { text: "🚗 Driving" },
    { text: "🏋️ At the gym" },
    { text: "🏠 Working from home" },
  ];

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setIsModalOpen(false);
  };

  const handleEmojiSelect = (emojiObject) => {
    setStatus((prevStatus) => prevStatus + emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  if (!currentUser) {
    return (
      <div className="userinfo">
        <p>No user data available.</p>
        <button className="back-to-login-btn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="User Avatar" />
        <div className="user-info">
          <h2 className="userName">{currentUser.fullname}</h2>
          <p className="userTitle">{currentUser.position}</p>
          <button onClick={() => setIsModalOpen(true)}>
            <p className="userStatus">
              {status ? `${status}` : "Set a status"}
            </p>
          </button>
        </div>
      </div>

      <div className="icons">
        <img
          src="./more.png"
          alt="More"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        {isMenuOpen && (
          <div className="popup-menu">
            <div
              className="menu-item"
              onClick={() => {
                setIsAccountSettingsModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Account Settings
            </div>
            <div className="menu-item" onClick={handleSignOut}>
              Sign Out
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Set a Status</h3>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="status-input-container">
              <input
                className="status-input"
                type="text"
                placeholder="Enter your custom status..."
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <button
                className="emoji-btn"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                😊
              </button>
            </div>

            {isEmojiPickerOpen && (
              <div className="emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  skinTonePickerLocation="SEARCH"
                  searchPlaceholder="Search emojis..."
                  width="100%"
                  height="350px"
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}

            <div className="status-list">
              {suggestedStatuses.map((item, index) => (
                <div
                  key={index}
                  className="status-item"
                  onClick={() => handleStatusSelect(item.text)}
                >
                  <span className="emoji">{item.emoji}</span> {item.text}
                </div>
              ))}
            </div>

            <button className="done-btn" onClick={() => setIsModalOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}

      {isAccountSettingsModalOpen && (
        <div className="modal-overlay">
          <div className="account-settings-modal">
            <div className="modal-header">
              <h3>Account Settings</h3>
              <button
                className="close-btn"
                onClick={() => setIsAccountSettingsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="account-settings-content">
              {/* Left Section: Personal Details */}
              <div className="personal-details">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={currentUser.fullname || ""}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={currentUser.username || ""}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  {isChangePasswordFormOpen ? (
                    <div className="change-password-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-container">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                          <i
                            className={`password-toggle-icon ${
                              showNewPassword
                                ? "fas fa-eye-slash"
                                : "fas fa-eye"
                            }`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          ></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input-container">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                          <i
                            className={`password-toggle-icon ${
                              showConfirmPassword
                                ? "fas fa-eye-slash"
                                : "fas fa-eye"
                            }`}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          ></i>
                        </div>
                      </div>
                      <button
                        className="submit-btn"
                        onClick={() => {
                          console.log("Password change submitted");
                          setIsChangePasswordFormOpen(false);
                        }}
                      >
                        Submit
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setIsChangePasswordFormOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="change-password-btn"
                      onClick={() => setIsChangePasswordFormOpen(true)}
                    >
                      Change Password
                    </button>
                  )}
                </div>
              </div>

              {/* Right Section: Profile Image */}
              <div className="profile-image-section">
                <div className="profile-image-container">
                  <img
                    src={currentUser.avatar || "./avatar.png"}
                    alt="Profile"
                    className="profile-image"
                  />
                  <button
                    className="change-photo-btn"
                    onClick={() => {
                      console.log("Change Photo clicked");
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setIsAccountSettingsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={() => setIsAccountSettingsModalOpen(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userinfo;
