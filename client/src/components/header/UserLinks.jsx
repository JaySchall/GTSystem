import { useNavigate } from "react-router-dom";
import "../../css/Login.css";
import "../../css/UserLinks.css";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const navigateTo = (path) => {
    setIsDropdownVisible(false);
    navigate(path);
  };

  useEffect(() => {
    setIsDropdownVisible(false);
  }, [user]);

  return (
    <div>
      <span style={{ position: "relative" }}>
        <ul>
          <li>
            {user ? (
              <div>
                <div className="dropdown-title" onClick={toggleDropdown}>
                  My Account
                </div>
                {isDropdownVisible && (
                  <div className="dropdown-menu">
                    <div className="dropdown-menu-item">
                      <div>Name:</div>
                      <div>{user.username}</div>
                    </div>
                    <div className="dropdown-menu-item">
                      <div>Role:</div>
                      <div>{user.isAdmin ? "Admin" : "User"}</div>
                    </div>
                    {user.isAdmin ? (
                      <div className="dropdown-menu-item admin-panel">
                        Admin Panel:
                        <div
                          className="admin-panel-button"
                          style={{ gridColumn: 1 }}
                          onClick={() => navigateTo("/create/event")}
                        >
                          Create New Event
                        </div>
                      </div>
                    ) : null}
                    <div className="dropdown-menu-item">
                      <div className="logout" onClick={() => logout()}>
                        Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="dropdown-title"
                onClick={() => navigate("/user/login")}
              >
                Sign In
              </div>
            )}
          </li>
        </ul>
      </span>
    </div>
  );
}
