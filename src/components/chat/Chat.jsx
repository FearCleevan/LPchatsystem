import { useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    // Keep the emoji picker open after selection
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
    };

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
            <div className="center">

                <div className="profile">
                    <img src="./avatar.png" alt="" className="avatar"/>
                    <p className="name">Jane Doe</p>
                </div>


                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <img src="./LPlogo2.png" alt="" />
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, mollitia sit amet voluptas suscipit error ipsam, delectus blanditiis facere corporis officia soluta deserunt optio alias ipsum saepe, odio beatae ducimus!</p>
                        <span>1 min ago</span>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
                <button className="sendButton">Send</button>
            </div>
        </div>
    );
};

export default Chat;
