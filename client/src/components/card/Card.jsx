import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { Trash2, Edit3 } from "lucide-react";

export default function Card({ item, setPosts, isOwnerView = false }) {
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleSavePost = async () => {
    console.log("[v0] Save post clicked for post ID:", item._id);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/api/v1/users/save`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: item._id }),
      });
      const data = await response.json();

      if (data.success) {
        console.log("[v0] Post saved successfully:", data);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === item._id ? { ...post, isSaved: !post.isSaved } : post
          )
        );
      } else {
        setPostsError("Failed to save post");
      }
    } catch (error) {
      console.error("[v0] Error saving post:", error);
      setPostsError(error.response?.data?.error || "Failed to save post");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/api/v1/posts/${item._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log("[v0] Property deleted successfully");
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== item._id));
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      console.error("[v0] Error deleting property:", error);
      alert("Error deleting property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-stone-100">
      {/* Image Container */}
      <Link to={`/${item._id}`} className="relative block h-56 md:h-64 overflow-hidden bg-stone-100">
        <img
          src={item.images[0] || "/default-property.jpg"}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {item.type === "rent" && (
          <div className="absolute top-4 right-4 bg-amber-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
            For Rent
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-stone-900 mb-2 line-clamp-2 hover:text-amber-700 transition-colors">
          <Link to={`/${item._id}`}>{item.title}</Link>
        </h2>

        {/* Address */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-amber-700">📍</span>
          <p className="text-stone-600 text-sm line-clamp-1">{item.address}</p>
        </div>

        {/* Price */}
        <div className="mb-4 pb-4 border-b border-stone-200">
          <p className="text-3xl font-bold text-amber-700">
            ${item.price.toLocaleString()}
          </p>
          {item.type === "rent" && item.rentalPeriod && (
            <p className="text-stone-600 text-sm font-medium">per {item.rentalPeriod}</p>
          )}
        </div>

        {/* Features */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg">
            <span className="text-lg">🛏️</span>
            <span className="text-stone-700 font-medium">
              {item.bedroom} {item.bedroom === 1 ? "bed" : "beds"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg">
            <span className="text-lg">🚿</span>
            <span className="text-stone-700 font-medium">
              {item.bathroom} {item.bathroom === 1 ? "bath" : "baths"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Save Button */}
          {!isOwnerView && (
            <button
              onClick={handleSavePost}
              className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {item.isSaved ? <FaBookmark className="text-amber-700" /> : <CiBookmark />}
              <span className="hidden sm:inline">Save</span>
            </button>
          )}

          {/* Edit Button */}
          {isOwnerView && (
            <Link to={`/update/${item._id}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </Link>
          )}

          {/* Delete Button */}
          {isOwnerView && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Delete"}</span>
            </button>
          )}

          {/* Chat Button (always visible) */}
          {!isOwnerView && (
            <button className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              <span className="text-lg">💬</span>
              <span className="hidden sm:inline">Message</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
