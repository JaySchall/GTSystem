import "../../css/Login.css";
import "../../css/UserLinks.css";
import { useAuth } from "../AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div>
      <span className="contact-links contact-links-1">
        <ul>
          <li>
            <a href="/create/event">Create Event</a>
          </li>
        </ul>
      </span>
      <span
        className="contact-links contact-links-2"
        style={{ position: "relative" }}
      >
        <ul>
          <li>
            {user ? (
              <div>
                <div className="dropdown-title" onClick={toggleDropdown}>
                  My Account
                </div>
                {isDropdownVisible && (
                  <div className="dropdown-menu">
                    <div>
                      <div>Name: {user.username}</div>
                      <div>Role: {user.isAdmin ? "Admin" : "User"}</div>
                      <div>
                        <div className="logout" onClick={() => logout()}>
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a href="/user/login">Sign In</a>
            )}
          </li>
        </ul>
      </span>
    </div>
  );
}
