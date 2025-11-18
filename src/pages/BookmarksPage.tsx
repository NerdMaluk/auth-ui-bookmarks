import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { clearToken } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import BookmarkForm from "../components/BookmarkForm";
import "../style.css";

interface Bookmark {
  id: number;
  title: string;
  link: string;
  description?: string;
}

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookmarks");
      setBookmarks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      await api.delete(`/bookmarks/${id}`);
      fetchBookmarks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bookmarks-container">

      <div className="header">
        <h2>My Bookmarks</h2>  
        <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      
      </div>
      
      <h4>Add a new bookmark:</h4>
      {/* Form para criar novos bookmarks */}
      <BookmarkForm onSuccess={fetchBookmarks} />

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : bookmarks.length === 0 ? (
        <p>No bookmarks found</p>
      ) : (
        <ul>
          {bookmarks.map((bm) => (
            <li key={bm.id} className="bookmark-item">
              <div>
                <h6>Title:</h6>
                <strong>{bm.title}</strong>
                <br />
                <br />
               <h6>Link:</h6>
                <a href={bm.link} target="_blank" rel="noopener noreferrer">
                  {bm.link}
                  <br />
                </a>
                <br />
                <h6>Description:</h6>
                {bm.description && <p>{bm.description}</p>}
                
              </div>
              <br />
              <div className="bookmark-buttons">
                {/* Form para editar o bookmark */}
                <BookmarkForm
                  onSuccess={fetchBookmarks}
                  initialData={{ title: bm.title, link: bm.link, description: bm.description }}
                  bookmarkId={bm.id}
                />
                <button onClick={() => handleDelete(bm.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarksPage;
