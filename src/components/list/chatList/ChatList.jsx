import { useState } from "react";
import "./chatList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [activeSection, setActiveSection] = useState("chats"); // Track active section

  // Function to handle navigation
  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {/* Navigation Bar */}
      <div className="navbar">
        <ul>
          <li onClick={() => handleNavClick("chats")}>
            <div
              className={`nav-item ${
                activeSection === "chats" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-message"></i>
              <span>Chats</span>
            </div>
          </li>
          <li onClick={() => handleNavClick("calls")}>
            <div
              className={`nav-item ${
                activeSection === "calls" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-video"></i>
              <span>Calls</span>
            </div>
          </li>
          <li onClick={() => handleNavClick("contacts")}>
            <div
              className={`nav-item ${
                activeSection === "contacts" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-address-book"></i>
              <span>Contacts</span>
            </div>
          </li>
          <li onClick={() => handleNavClick("notifications")}>
            <div
              className={`nav-item ${
                activeSection === "notifications" ? "active" : ""
              }`}
            >
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Conditional Rendering Based on Active Section */}
      {activeSection === "chats" && (
        <div className="section">
          <div className="item">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <span>Jane Doe</span>
              <p>Hello</p>
            </div>
          </div>
          <div className="item">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <span>Jane Doe</span>
              <p>Hello</p>
            </div>
          </div>
          <div className="item">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <span>Jane Doe</span>
              <p>Hello</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "calls" && (
        <div className="tab-content">
          <h3>Calls</h3>
          <p>No recent calls.</p>
        </div>
      )}

      {activeSection === "contacts" && (
        <div className="tab-content">
          <h3>Contacts</h3>
          <p>List of contacts will appear here.</p>
        </div>
      )}

      {activeSection === "notifications" && (
        <div className="tab-content">
          <h3>Notifications</h3>
          <p>You have no new notifications.</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
