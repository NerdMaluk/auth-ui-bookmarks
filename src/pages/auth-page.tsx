import React from "react";
import { useState } from "react";
import AuthForm from "../components/auth-form";
import "../style.css";

const AuthPage = () => {
  const [mode, setMode] = useState<"signup" | "signin">("signin");

  return (
    <div className="auth-box">
      <h2 className="auth-title">{mode === "signin" ? "Sign In" : "Create Account"}</h2>

      <AuthForm mode={mode} />

      <div className="auth-switch">
        {mode === "signin" ? (
          <>
            <span>Don't have an account? </span>
            <button onClick={() => setMode("signup")}>Sign Up here</button>
          </>
        ) : (
          <>
            <span>Already have an account? </span>
            <button onClick={() => setMode("signin")}>Sign In here</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
