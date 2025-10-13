import { Navigate } from "react-router-dom";

export default function Protected({ children, login }) {
  const isLoggedIn = login || !!localStorage.getItem("login"); 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
