import { useState } from "react";
import "./chatList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ChatList = () => {
  const [activeTab, setActiveTab] = useState("chats"); // Default active tab

  return (
    <div className="chatList">
      {/* Search Bar */}
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img src="./plus.png" alt="" className="add" />
      </div>

      {/* Navbar */}
      <div className="navbar">
        <ul>
          <li onClick={() => setActiveTab("chats")} className={activeTab === "chats" ? "active" : ""}>
            <div className="nav-item">
              <i className="fa-solid fa-message"></i>
              <span>Chats</span>
            </div>
          </li>
          <li onClick={() => setActiveTab("calls")} className={activeTab === "calls" ? "active" : ""}>
            <div className="nav-item">
              <i className="fa-solid fa-video"></i>
              <span>Calls</span>
            </div>
          </li>
          <li onClick={() => setActiveTab("contacts")} className={activeTab === "contacts" ? "active" : ""}>
            <div className="nav-item">
              <i className="fa-solid fa-address-book"></i>
              <span>Contacts</span>
            </div>
          </li>
          <li onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "active" : ""}>
            <div className="nav-item">
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Content Switching Based on Active Tab */}
      <div className="content">
        {activeTab === "chats" && (
          <div className="tab-content">
            <h3>Chats</h3>
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
                <span>John Smith</span>
                <p>Hey!</p>
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
                <span>John Smith</span>
                <p>Hey!</p>
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
                <span>John Smith</span>
                <p>Hey!</p>
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
                <span>John Smith</span>
                <p>Hey!</p>
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
                <span>John Smith</span>
                <p>Hey!</p>
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
                <span>John Smith</span>
                <p>Hey!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calls" && (
          <div className="tab-content">
            <h3>Calls</h3>
            <p>No recent calls.</p>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="tab-content">
            <h3>Contacts</h3>
            <p>List of contacts will appear here.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="tab-content">
            <h3>Notifications</h3>
            <p>You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
