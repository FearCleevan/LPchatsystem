import {
    FaBell,
    FaCog,
    FaComments,
    FaSignOutAlt,
    FaUsers,
    FaUserShield,
  } from "react-icons/fa";
  import "./chatRoom.css";
  import { Link, useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import { doc, onSnapshot, collection, addDoc, getDocs } from "firebase/firestore";
  import { useUserStore } from "../../lib/userStore";
  import { db } from "../../lib/firebase";
  import CreateGroupChatModal from "../../components/createGroupChatModal/CreateGroupChatModal";
  
  const ChatRoom = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const { currentUser } = useUserStore();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupChats, setGroupChats] = useState([]);
    const [users, setUsers] = useState([]);
  
    // Fetch group chats from Firestore
    useEffect(() => {
      const fetchGroupChats = async () => {
        try {
          const groupChatsCollection = collection(db, "groupChats");
          const unsubscribe = onSnapshot(groupChatsCollection, (snapshot) => {
            const groupChatsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setGroupChats(groupChatsList);
          });
  
          return () => unsubscribe(); // Cleanup on unmount
        } catch (error) {
          console.error("Error fetching group chats: ", error);
        }
      };
  
      fetchGroupChats();
    }, []);
  
    // Fetch users from Firestore
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const usersCollection = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      };
  
      fetchUsers();
    }, []);
  
    // Handle group chat creation
    const handleCreateGroupChat = async ({ groupName, selectedUsers, avatarUrl }) => {
      if (!groupName || selectedUsers.length === 0) {
        alert("Please provide a group name and select at least one user.");
        return;
      }
  
      try {
        // Prepare the group chat data
        const groupChatData = {
          name: groupName,
          members: selectedUsers.map((user) => user.id), // Save user IDs
          avatar: avatarUrl || "./group-avatar.png", // Use the uploaded avatar or a default one
          createdAt: new Date().toISOString(), // Timestamp for creation
        };
  
        // Add the group chat to Firestore
        const groupChatsCollection = collection(db, "groupChats");
        await addDoc(groupChatsCollection, groupChatData);
  
        // Close the modal
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating group chat: ", error);
        alert("Failed to create group chat. Please try again.");
      }
    };
  
    // Fetch unread messages count
    useEffect(() => {
      if (!currentUser) return;
  
      const unsubscribe = onSnapshot(
        doc(db, "userchats", currentUser.id),
        (doc) => {
          if (doc.exists()) {
            const chats = doc.data().chats;
            let newMessageCount = 0;
  
            // Check for unread messages
            chats.forEach((chat) => {
              if (!chat.isSeen) {
                newMessageCount++;
              }
            });
  
            setNotificationCount(newMessageCount);
          }
        }
      );
  
      return () => unsubscribe();
    }, [currentUser]);
  
    const handleNotificationClick = () => {
      setNotificationCount(0);
      navigate("/chat-list");
    };
  
    return (
      <div className="dashboard-container">
        <div className="sidebar">
          <h2>Admin Panel</h2>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard-list">
                  <FaUserShield /> Dashboard
                </Link>
              </li>
              <li className="links">
                <Link to="/chat-list">
                  <FaComments /> Chat List
                </Link>
              </li>
              <li>
                <Link to="/chat-room">
                  <FaUsers /> Chat Room
                </Link>
              </li>
              <li>
                <FaCog /> Account Settings
              </li>
              <li className="logout">
                <FaSignOutAlt /> Log Out
              </li>
            </ul>
          </nav>
        </div>
  
        <div className="main-content">
          <div className="user-header">
            <div className="notification-icon" onClick={handleNotificationClick}>
              <FaBell />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
            <div className="user-info">
              <img
                src={currentUser.avatar || "./avatar.png"}
                alt="User Avatar"
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{currentUser.fullname}</span>
                <span className="user-role">{currentUser.position}</span>
              </div>
            </div>
          </div>
  
          <h1>Chat Room</h1>
  
          <div className="user-table-container">
            <h2>Group Chat List</h2>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by group chat name..."
            />
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Group Chat Name</th>
                    <th>Members</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupChats.map((group) => (
                    <tr key={group.id}>
                      <td>
                        <img
                          src={group.avatar || "./group-avatar.png"}
                          alt={group.name}
                          className="group-avatar"
                        />
                      </td>
                      <td>{group.name}</td>
                      <td>
                        {group.members
                          .map((userId) => {
                            const user = users.find((u) => u.id === userId);
                            return user ? user.fullname : "Unknown User";
                          })
                          .join(", ")}
                      </td>
                      <td>{new Date(group.createdAt).toLocaleString()}</td>
                      <td className="action-buttons">
                        <div className="actions">
                          <button className="view-btn">View</button>
                          <button className="add-btn">Add</button>
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="add-user-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create Group Chat
            </button>
          </div>
        </div>
  
        {/* Modal for creating group chat */}
        <CreateGroupChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateGroupChat}
        />
      </div>
    );
  };
  
  export default ChatRoom;