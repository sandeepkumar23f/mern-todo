import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import "../style/index.css";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("login");
    setLogin(null);
    // ✅ redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    const handleStorage = () => {
      setLogin(localStorage.getItem("login"));
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">To-Do App</div>
      <ul className="nav-links">
        {login ? (
          <>
            <li>
              <Link to="/">List</Link>
            </li>
            <li>
              <Link to="/add">Add Task</Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}
