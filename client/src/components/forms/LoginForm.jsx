import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const LoginForm = () => {
  const { login }= useAuth();
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (regUsername.length < 1) {
      alert("Username field cannot be empty");
      return;
    }

    if (regPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (
      regPassword.length < 4 ||
      !regPassword.match(/[A-Z]/) ||
      !regPassword.match(/[!@#$%^&*(),.?":{}|<>]/)
    ) {
      alert("Password should be at least 8 characters and contain one capital letter and a special character.");
      return;
    }

    try {
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: regUsername, password: regPassword})
      });

      const registerData = await registerResponse.json();

      if (registerData.success) {
        alert(registerData.message);
        setRegUsername("");
        setRegPassword("");
        setConfirmPassword("");
      } else {
        alert("Registration failed. Please try again. ");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred at Register.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/check-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword})
      });

      if (response.ok) {
        alert("Login successful");
        const userData = await response.json();
        login(userData);
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred at Login. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "60%", margin: "0 auto" }}>
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="loginUsername">Username:</label>
        <input type="text" id="loginUsername" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} style={{ width: "300px" }} />
        <br />
        <label htmlFor="loginPassword">Password:</label>
        <input type="password" id="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "300px" }} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>

    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleRegistration}>
        <label htmlFor="regUsername">Username:</label>
        <input type="text" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} style={{ width: "300px" }} />
        <br />
        <label htmlFor="regPassword">Password:</label>
        <input type="password" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: "300px" }} />
        <br />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "300px" }} />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
  );
};

export default LoginForm;
