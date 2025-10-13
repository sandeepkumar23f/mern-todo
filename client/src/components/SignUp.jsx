import { useState } from "react";
import "../style/signup.css";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let result = await fetch("http://localhost:5000/signup", {
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
        alert(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>

      <label>Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />

      <label>Email</label>
      <input
        type="text"
        placeholder="Enter your email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />

      <button onClick={handleSignUp} className="submit">
        Sign Up
      </button>

      <Link to="/login">Login</Link>
    </div>
  );
}
