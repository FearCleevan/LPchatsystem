import { useEffect, useState } from "react";
import "./chatList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return ""; // Handle undefined or null values
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [activeSection, setActiveSection] = useState("chats");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  // Calculate the number of unread messages
  const unreadNotifications = chats.filter((chat) => !chat.isSeen).length;

  useEffect(() => {
    if (!currentUser) return;

    // Fetch individual chats
    const unSubIndividual = onSnapshot(
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
            return null;
          }

          const user = userDocSnap.data();
          return { ...item, user, type: "individual" }; // Add type to distinguish between individual and group chats
        });

        const individualChats = (await Promise.all(promises)).filter(Boolean);

        // Fetch group chats
        const groupChatsCollection = collection(db, "groupChats");
        const groupChatsSnapshot = await getDocs(groupChatsCollection);
        const groupChats = groupChatsSnapshot.docs
          .filter((doc) => doc.data().members.includes(currentUser.id)) // Filter group chats where the current user is a member
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: "group", // Add type to distinguish between individual and group chats
          }));

        // Combine individual and group chats
        const allChats = [...individualChats, ...groupChats].sort(
          (a, b) => b.updatedAt - a.updatedAt
        );

        setChats(allChats);
      }
    );

    return () => {
      unSubIndividual();
    };
  }, [currentUser]);

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const handleSelect = async (chat) => {
    if (chat.type === "individual") {
      // Handle individual chat selection
      if (!chat.user) {
        console.error("User data is missing for chat:", chat);
        return;
      }
  
      const userChats = chats
        .filter((item) => item.type === "individual")
        .map((item) => {
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
        changeChat(chat.chatId, chat.user, "individual"); // Set chatType to "individual"
      } catch (err) {
        console.log(err);
      }
    } else if (chat.type === "group") {
      // Handle group chat selection
      changeChat(chat.id, null, "group"); // Pass group chat ID and name, and set chatType to "group"
    }
  };

  const filteredChats = chats.filter((c) => {
    if (c.type === "individual") {
      return c.user?.fullname?.toLowerCase().includes(input.toLowerCase());
    } else if (c.type === "group") {
      return c.name?.toLowerCase().includes(input.toLowerCase());
    }
    return false; // Exclude chats with unknown types
  });

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
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
          {filteredChats.map((chat) => (
            <div
              className="item"
              key={chat.chatId || chat.id} // Use chat.id for group chats
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img
                src={
                  chat.type === "individual"
                    ? chat.user?.avatar || "./avatar.png" // Individual chat avatar
                    : chat.avatar || "./group-avatar.png" // Group chat avatar (use the uploaded avatar or a default one)
                }
                alt=""
              />
              <div className="texts">
                <span>
                  {chat.type === "individual"
                    ? chat.user?.fullname || "Unknown User" // Individual chat name
                    : chat.name // Group chat name
                  }
                </span>
                <p>{truncateText(chat.lastMessage, 15)}</p>
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