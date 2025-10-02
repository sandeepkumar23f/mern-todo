import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import "../style/index.css";

export default function Navbar({ login, setLogin }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("login");
    setLogin(false); // App state update
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">To-Do App</div>
      <ul className="nav-links">
        {login && (
          <>
            <li><Link to="/">List</Link></li>
            <li><Link to="/add">Add Task</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}
