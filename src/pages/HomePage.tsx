import React from "react";
import { useDispatch } from "react-redux";
import { clearToken } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Home!</h1>
      <p>This page is protected.</p>
      <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
