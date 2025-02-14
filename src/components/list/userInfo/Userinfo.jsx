import React, { useState } from "react";
import "./userInfo.css"; // Ensure this file exists and is compiled correctly

const Userinfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(""); // Ensure status is updated correctly

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
    setIsModalOpen(false); // Close modal after selecting a status
  };

  return (
    <div className="userinfo">
      <div className="user">
        <img src="./avatar.png" alt="User Avatar" />
        <div className="user-info">
          <h2 className="userName">Paul Lazan</h2>
          <p className="userTitle">Admin</p>
          <button onClick={() => setIsModalOpen(true)}>
            <p className="userStatus">
              {status ? `${status}` : "Set a status"}
            </p>
          </button>
        </div>
      </div>

      <div className="icons">
        <img src="./more.png" alt="More" />
        <img src="./video.png" alt="Video" />
        <img src="./edit.png" alt="Edit" />
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

            <input
              className="status-input"
              type="text"
              placeholder="Enter your custom status..."
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

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
    </div>
  );
};

export default Userinfo;
