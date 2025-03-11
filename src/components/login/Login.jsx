import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import { useUserRole } from "../../context/UserRoleContext";
import { useUserStore } from "../../lib/userStore"; // Import useUserStore

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUserRole } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUserInfo } = useUserStore(); // Use fetchUserInfo from useUserStore

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user info and set it in useUserStore
      await fetchUserInfo(user.uid);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setErrorMessage("User data not found.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userRole = userData.position;

      setUserRole(userRole);
      localStorage.setItem("userRole", userRole);

      // Redirect based on the user's role
      if (userRole === "admin") {
        navigate("/dashboard-list");
      } else if (userRole === "teamleader" || userRole === "agent") {
        navigate("/chat-list");
      } else {
        setErrorMessage("Invalid role. Please contact support.");
      }
    } catch (err) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-item">
        <img src="./LP LOgo.png" alt="Logo" />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="login-input"
            required
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="login-input"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="remember-me-container">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button disabled={loading} type="submit" className="login-button">
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;