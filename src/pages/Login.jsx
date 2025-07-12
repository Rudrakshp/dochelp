// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email.trim() && password.trim()) {
      navigate("/dashboard");
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">👨‍⚕️ Doctor Login</h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <button
          onClick={() => navigate("/chatbot")}
          className="chatbot-button"
        >
          🧠 Talk to Mental Health Chatbot
        </button>
      </div>
    </div>
  );
}
