import React  from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  mode: "signup" | "signin";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    const payload =
      mode === "signin"
        ? { email, password }
        : { email, password, confirmPassword: confirm };

    try {
      setLoading(true);

      if (mode === "signup") {
        await axios.post("http://localhost:3000/auth/signup", payload);
        alert("User created successfully!");
      } else {
        const response = await axios.post("http://localhost:3000/auth/signin", payload);
        const { access_token } = response.data;

        dispatch(setToken(access_token));
        localStorage.setItem("token", access_token);

        alert("Login successful!");
        navigate("/bookmarks"); // redireciona direto para bookmarks
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
        required
      />
      {mode === "signup" && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="auth-input"
          required
        />
      )}
      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
