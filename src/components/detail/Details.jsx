import { useState, useEffect } from "react";
import "./detail.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserRole } from "../../context/UserRoleContext";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { doc, onSnapshot } from "firebase/firestore";

const Detail = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const { userRole, setUserRole } = useUserRole();
  const navigate = useNavigate();
  const { currentUser, clearUser } = useUserStore();
  const { chatId, user } = useChatStore();

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (doc.exists()) {
        const messages = doc.data().messages;
        const photos = messages
          .flatMap((message) => message.img || [])
          .filter((img) => img);
        setSharedPhotos(photos);

        const files = messages
          .flatMap((message) => message.docs || [])
          .filter((doc) => doc);
        setSharedFiles(files);
      }
    });

    return () => unSub();
  }, [chatId]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserRole(null);
      localStorage.removeItem("userRole");
      clearUser();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const togglePhotos = () => {
    setShowPhotos((prev) => !prev);
    setShowFiles(false);
  };

  const toggleFiles = () => {
    setShowFiles((prev) => !prev);
    setShowPhotos(false);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{user?.fullname || "Unknown User"}</h2>
        <p>{user?.position || "Unknown Role"}</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="Toggle" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="Toggle" />
          </div>
        </div>

        <div className="option">
          <div className="title" onClick={togglePhotos}>
            <span>Shared Photos</span>
            <img
              src={showPhotos ? "./arrowDown.png" : "./arrowUp.png"}
              alt="Toggle"
            />
          </div>
          {showPhotos && (
            <div className="photos">
              {sharedPhotos.map((imgSrc, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <img
                      src={imgSrc}
                      alt="Shared"
                      onClick={() => setSelectedImage(imgSrc)}
                    />
                    <span>Photo {index + 1}</span>
                  </div>
                  <img src="./download.png" alt="Download" className="icon" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="option">
          <div className="title" onClick={toggleFiles}>
            <span>Shared Files</span>
            <img
              src={showFiles ? "./arrowDown.png" : "./arrowUp.png"}
              alt="Toggle"
            />
          </div>
          {showFiles && (
            <div className="photos">
              {sharedFiles.map((file, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="./document-256.png" alt="File" />
                    </a>
                    <span>{file.name}</span>
                  </div>
                  <a href={file.url} download>
                    <img src="./download.png" alt="Download" className="icon" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {userRole === "admin" && (
          <button className="logout">
            <Link to="/dashboard-list">back to dashboard</Link>
          </button>
        )}
      </div>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="Preview" />
          </div>
        </div>
      )}

      <div className="buttons">
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;