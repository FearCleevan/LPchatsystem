import { useState } from "react";
import "./detail.css";

const Detail = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="detail">

            <div className="user">
                <img src="./avatar.png" alt="User Avatar" />
                <h2>Jane Doe</h2>
                <p>Lorem ipsum dolor sit amet.</p>
                <div className="menu">
                    <ul>
                        <li>
                            <div className="nav-item">
                                <i className="fa-solid fa-message"></i>
                                <span>Chats</span>
                            </div>
                        </li>
                        <li>
                            <div className="nav-item">
                                <i className="fa-solid fa-message"></i>
                                <span>Chats</span>
                            </div>
                        </li>
                        <li>
                            <div className="nav-item">
                                <i className="fa-solid fa-message"></i>
                                <span>Chats</span>
                            </div>
                        </li>
                    </ul>
                </div>
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
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="Toggle" />
                    </div>
                    <div className="photos">
                        {["./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png", "./LPlogo2.png"].map((imgSrc, index) => (
                            <div className="photoItem" key={index}>
                                <div className="photoDetail">
                                    <img src={imgSrc} alt="Shared" onClick={() => setSelectedImage(imgSrc)} />
                                    <span>LPlogo2.png</span>
                                </div>
                                <img src="./download.png" alt="Download" className="icon" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="Toggle" />
                    </div>
                </div>


            </div>

            {/* Image Modal for Preview */}
            {selectedImage && (
                <div className="modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Preview" />
                    </div>
                </div>
            )}

            <div className="buttons">
                {/* <button>Block User</button> */}
                <button className="logout">Logout</button>
            </div>
            
        </div>
    );
};

export default Detail;
