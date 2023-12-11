import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log("You must be an admin to access the page.");

  if (!user || user.isAdmin !== 1) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
