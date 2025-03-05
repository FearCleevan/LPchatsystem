import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaUserShield,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import "./admindashboard.css";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const AdminDashboard = () => {
  const { currentUser } = useUserStore();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [notificationCount, setNotificationCount] = useState(0); // Initialize notification count
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

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
    // Reset notification count when the admin clicks the notification icon
    setNotificationCount(0);
    navigate("/chat-list"); // Redirect to the chat list or messages page
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCloudinaryWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "dtebf3uea",
        uploadPreset: "lp_upload_preset",
        sources: ["local", "url"],
        multiple: false,
        cropping: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setAvatar({
            file: null,
            url: result.info.secure_url,
          });
        }
      }
    );
  };

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { fullname, username, email, password, role } =
      Object.fromEntries(formData);

    const originalUser = auth.currentUser;
    const originalEmail = originalUser.email;
    const originalPassword = prompt("Enter your password to confirm:");

    if (!originalPassword) {
      toast.error("Password is required to confirm the action.");
      setLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = res.user;

      await setDoc(doc(db, "users", newUser.uid), {
        username,
        email,
        id: newUser.uid,
        position: role,
        fullname,
        avatar: avatar.url,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", newUser.uid), {
        chats: [],
      });

      await signOut(auth);
      await signInWithEmailAndPassword(auth, originalEmail, originalPassword);

      const updatedUser = {
        id: newUser.uid,
        fullname,
        username,
        email,
        position: role,
        avatar: avatar.url,
      };

      setUsers((prevUsers) => [...prevUsers, updatedUser]);

      toast.success("Account Created for " + fullname, {
        autoClose: 3000,
      });

      setTimeout(() => {
        setShowModal(false);
      }, 3000);

      console.log("User created:", newUser);
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));

      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteUser(user);
      } else {
        toast.error("You can only delete the currently logged-in user.");
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("User deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
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
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <FaUserShield /> Dashboard
            </li>
            <li className="links">
              <Link to="/chat-list">
                <FaUsers /> Chat List
              </Link>
            </li>
            <li>
              <FaComments /> Chat Room
            </li>
            <li>
              <FaCog /> Account Settings
            </li>
            <li className="logout" onClick={handleLogout}>
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

        <h1>Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <FaUser className="stat-icon" />
            <h3>Agents</h3>
            <p>{users.filter((user) => user.position === "agent").length}</p>
          </div>
          <div className="stat-card">
            <FaUserShield className="stat-icon" />
            <h3>Team Leaders</h3>
            <p>
              {users.filter((user) => user.position === "teamleader").length}
            </p>
          </div>
          <div className="stat-card">
            <FaUserShield className="stat-icon" />
            <h3>Admins</h3>
            <p>{users.filter((user) => user.position === "admin").length}</p>
          </div>
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h3>Online Users</h3>
            <p>{users.length}</p>
          </div>
        </div>

        <div className="user-table-container">
          <h2>User List</h2>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 100).map((user) => (
                  <tr key={user.id}>
                    <td className="user-info">
                      <img
                        src={user.avatar || "./avatar.png"}
                        alt="User Avatar"
                        className="avatar"
                      />
                    </td>
                    <td>{truncateText(user.fullname, 12)}</td>
                    <td>{truncateText(user.username, 12)}</td>
                    <td>{truncateText(user.email, 12)}</td>
                    <td>{truncateText(user.position, 12)}</td>
                    <td className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="add-user-btn" onClick={() => setShowModal(true)}>
            Add User
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <h2>Add New User</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="file" className="avatar-upload">
                <img src={avatar.url || "./avatar.png"} alt="User Avatar" />
                <button type="button" onClick={openCloudinaryWidget}>
                  Upload an Image
                </button>
              </label>
              <input type="text" placeholder="Full Name" name="fullname" />
              <input type="text" placeholder="Username" name="username" />
              <input type="email" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <select name="role" className="styled-select" defaultValue="">
                <option disabled value="">
                  Select a role
                </option>
                <option value="agent">Agent</option>
                <option value="teamleader">Team Leader</option>
                <option value="admin">Admin</option>
              </select>
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button disabled={loading} className="add-btn">
                  {loading ? "Loading" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
