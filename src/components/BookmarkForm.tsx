import React from "react";
import { useState } from "react";
import api from "../api/axiosInstance";

interface Props {
  onSuccess: () => void;
  initialData?: { title: string; link: string; description?: string };
  bookmarkId?: number;
}

const BookmarkForm = ({ onSuccess, initialData, bookmarkId }: Props) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const payload = { title, link, description };

      if (bookmarkId) {
        await api.patch(`/bookmarks/${bookmarkId}`, payload);
      } else {
        await api.post("/bookmarks", payload);
      }

      setTitle("");
      setLink("");
      setDescription("");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: "8px", marginRight: "8px" }}
      />
     
      <input
        type="url"
        placeholder="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button type="submit" style={{ padding: "8px 16px" }} disabled={loading}>
        {bookmarkId ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default BookmarkForm;
