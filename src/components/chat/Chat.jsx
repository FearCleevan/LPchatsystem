import { useState } from "react";
import "./chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="User Avatar" />
          <div className="user-info">
            <h2 className="userName">Jane Doe</h2>
            <p className="userTitle">Agent</p>
            <p className="userStatus">Active Now</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center"></div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" />
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;
