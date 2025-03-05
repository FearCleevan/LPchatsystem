import { useEffect, useState } from "react";
import "./chatList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeSection, setActiveSection] = useState("chats");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  // Calculate the number of unread messages
  const unreadNotifications = chats.filter((chat) => !chat.isSeen).length;

  useEffect(() => {
    // Check if currentUser is null
    if (!currentUser) {
      return; // Exit early if currentUser is null
    }

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        if (!res.exists()) {
          console.log("No userchats document found.");
          return;
        }

        const items = res.data().chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            console.log("User document not found for receiverId:", item.receiverId);
            return null; // Skip this item if the user document doesn't exist
          }

          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = (await Promise.all(promises)).filter(Boolean); // Filter out null values

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser]);

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const handleSelect = async (chat) => {
    if (!chat.user) {
      console.error("User data is missing for chat:", chat);
      return;
    }

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    if (chatIndex === -1) {
      console.error("Chat not found in userChats:", chat.chatId);
      return;
    }

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
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
              {/* Notification Badge */}
              {unreadNotifications > 0 && (
                <span className="notification-badge">
                  {unreadNotifications}
                </span>
              )}
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
          {chats.map((chat) => (
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img
                src={chat.user?.avatar || "./avatar.png"} // Fallback to default avatar if user.avatar is missing
                alt=""
              />
              <div className="texts">
                <span>{chat.user?.fullname || "Unknown User"}</span> {/* Fallback to "Unknown User" if fullname is missing */}
                <p>{truncateText(chat.lastMessage, 15)}</p> {/* Truncate lastMessage */}
              </div>
            </div>
          ))}
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
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;