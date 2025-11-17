import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance"; // instância axios com token
import { useDispatch } from "react-redux";
import { clearToken } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

interface Bookmark {
  id: number;
  title: string;
  url: string;
}

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/bookmarks");
        setBookmarks(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <p>Loading bookmarks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleLogout} style={{ padding: "10px", marginBottom: "20px" }}>
        Logout
      </button>
      <h2>Bookmarks</h2>
      <ul>
        {bookmarks.map((bm) => (
          <li key={bm.id}>
            <a href={bm.url} target="_blank" rel="noopener noreferrer">
              {bm.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarksPage;
