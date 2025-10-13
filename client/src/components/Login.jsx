import { useState, useEffect } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!userData.email || !userData.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      let result = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
      });

      result = await result.json();

      if (result.success) {
        localStorage.setItem("login", userData.email);
        navigate("/"); // redirect to task list
      } else {
        alert(result.message || "Wrong credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <label>Email</label>
      <input
        type="text"
        placeholder="Enter user email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter user password"
        value={userData.password}
        onChange={(e) =>
          setUserData({ ...userData, password: e.target.value })
        }
      />

      <button onClick={handleLogin} className="submit">
        Login
      </button>

      <Link to="/signup">Sign Up</Link>
    </div>
  );
}
