import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedLoginRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedLoginRoute;
