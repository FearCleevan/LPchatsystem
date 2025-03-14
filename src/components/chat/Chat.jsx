import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, user, chatType } = useChatStore(); // Add chatType

  const endRef = useRef(null);
  const inputRef = useRef(null);

  const normalizedMessages = chat?.messages?.map((message) => ({
    ...message,
    img: Array.isArray(message.img)
      ? message.img
      : message.img
      ? [message.img]
      : [],
    docs: Array.isArray(message.docs)
      ? message.docs
      : message.docs
      ? [message.docs]
      : [],
  }));

  const allImages = normalizedMessages
    ?.flatMap((message) => message.img)
    .filter((img) => img);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (!chatId) return;

    // Determine the Firestore collection based on chatType
    const collectionName = chatType === "group" ? "groupChats" : "chats";

    const unSub = onSnapshot(doc(db, collectionName, chatId), (res) => {
      if (res.exists()) {
        const messages = res.data().messages;

        // Update the status to "seen" for the last message if the recipient is viewing the chat
        const lastMessage = messages[messages.length - 1];
        if (
          lastMessage?.senderId === currentUser.id && // Last message is from the current user
          lastMessage.status === "delivered" && // Status is still "delivered"
          (chatType === "individual" ? user?.id === currentUser.id : true) // For group chats, skip user check
        ) {
          const updatedMessages = messages.map((msg, index) =>
            index === messages.length - 1 ? { ...msg, status: "seen" } : msg
          );

          updateDoc(doc(db, collectionName, chatId), {
            messages: updatedMessages,
          });
        }

        setChat(res.data());
      } else {
        setChat(null);
      }
    });

    return () => {
      unSub();
    };
  }, [chatId, currentUser?.id, user?.id, chatType]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lp_upload_preset");
    formData.append("cloud_name", "dtebf3uea");

    const endpoint = file.type.startsWith("image")
      ? "image/upload"
      : "raw/upload";

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dtebf3uea/${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return {
        url: data.secure_url,
        name: file.name,
        type: file.type.startsWith("image") ? "image" : "file",
      };
    } catch (err) {
      console.error("Error uploading file:", err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!currentUser) {
      console.error("User is not logged in.");
      return;
    }

    if (text === "" && files.length === 0) return;

    const uploads = await Promise.all(files.map((file) => handleUpload(file)));

    const newMessage = {
      senderId: currentUser.id,
      text: text || "",
      img: uploads
        .filter((upload) => upload?.type === "image")
        .map((upload) => upload.url),
      docs: uploads
        .filter((upload) => upload?.type === "file")
        .map((upload) => ({
          url: upload.url,
          name: upload.name,
        })),
      createdAt: new Date(),
      status: "delivered",
    };

    // Determine the Firestore collection based on chatType
    const collectionName = chatType === "group" ? "groupChats" : "chats";

    await updateDoc(doc(db, collectionName, chatId), {
      messages: arrayUnion(newMessage),
    });

    // Update last message in userchats (for individual chats only)
    if (chatType === "individual") {
      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text || "📷 Image";
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    }

    setText("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setFiles((prev) => [...prev, file]);
        }
      }
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener("paste", handlePaste);
    }
    return () => {
      if (input) {
        input.removeEventListener("paste", handlePaste);
      }
    };
  }, []);

  const handleImageClick = (image, index) => {
    setPreviewImage(image);
    setPreviewIndex(index);
    setShowPreviewModal(true);
  };

  const handleNextImage = () => {
    if (previewIndex < allImages.length - 1) {
      setPreviewIndex(previewIndex + 1);
      setPreviewImage(allImages[previewIndex + 1]);
    }
  };

  const handlePrevImage = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
      setPreviewImage(allImages[previewIndex - 1]);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img
            src={
              chatType === "group"
                ? chat?.avatar || "./group-avatar.png" // Use group avatar
                : user?.avatar || "./avatar.png" // Use user avatar
            }
            alt={chatType === "group" ? "Group Avatar" : "User Avatar"}
          />
          <div className="user-info">
            <h2 className="userName">
              {chatType === "group"
                ? chat?.name
                : user?.fullname || "Unknown User"}
            </h2>
            <p className="userTitle">
              {chatType === "group"
                ? "Group Chat"
                : user?.position || "Unknown Role"}
            </p>
            <p className="userStatus">Active Now</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <div className="center">
        {normalizedMessages?.map((message, index) => (
          <div
            className={`message ${
              message.senderId === currentUser.id ? "own" : ""
            }`}
            key={message.createdAt}
          >
            {message.senderId !== currentUser.id && (
              <div className="message-user-info">
                <img
                  src={
                    chatType === "group"
                      ? "./group-avatar.png" // Use group avatar for group chats
                      : user?.avatar || "./avatar.png" // Use user avatar for individual chats
                  }
                  alt="User Avatar"
                  className="message-avatar"
                />
                <span className="message-username">
                  {chatType === "group"
                    ? "Group Member"
                    : user?.fullname || "Unknown User"}
                </span>
              </div>
            )}
            <div className="texts">
              {message.img?.map((imgSrc, imgIndex) => (
                <img
                  key={imgIndex}
                  src={imgSrc}
                  alt="Chat image"
                  className="chat-image"
                  onClick={() => handleImageClick(imgSrc, imgIndex)}
                />
              ))}
              {message.docs?.map((doc, docIndex) => (
                <a
                  key={docIndex}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-link"
                >
                  📄 {doc.name || "Document"}
                </a>
              ))}
              {message.text && <p>{message.text}</p>}
              <span>
                {new Date(message.createdAt?.toDate()).toLocaleTimeString()}
              </span>
              {index === normalizedMessages.length - 1 &&
                message.senderId === currentUser.id && (
                  <span className="message-status">
                    {message.status === "delivered" ? "Delivered" : "Seen"}
                  </span>
                )}
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        {files.map((file, index) => (
          <div key={index} className="file-preview">
            <span>{file.name}</span>
            <button onClick={() => handleRemoveFile(index)}>✖</button>
          </div>
        ))}

        <div className="input-container">
          <div className="icons">
            <label htmlFor="file">
              <img src="./send-file.png" alt="" />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
              accept="image/*, .doc, .docx, .pdf, .ppt, .pptx"
            />
            <img src="./camera.png" alt="" />
            <img src="./mic.png" alt="" />
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <button className="sendButton" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>

      {showPreviewModal && (
        <div
          className="preview-modal"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setShowPreviewModal(false)}
            >
              ✖
            </button>
            <div className="image-container">
              <img src={previewImage} alt="Preview" className="zoomed-image" />
            </div>
            <button className="nav-button prev" onClick={handlePrevImage}>
              &#10094;
            </button>
            <button className="nav-button next" onClick={handleNextImage}>
              &#10095;
            </button>
            <div className="thumbnail-container">
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Thumbnail"
                  className={`thumbnail ${
                    index === previewIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    setPreviewImage(image);
                    setPreviewIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
