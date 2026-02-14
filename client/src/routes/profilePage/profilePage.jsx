import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useAuthUser } from "../../hooks/jwt/useAuthUser";
import List from "@/components/list/List";
import Chat from "@/components/chat/Chat";

function ProfilePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const userInfo = useAuthUser();
  
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [chatsError, setChatsError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        setPostsError(null);

        const response = await fetch(`${import.meta.env.VITE_SERVER_API}/api/v1/users/profilePosts`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") 
          },
          body: JSON.stringify({ userId: userInfo.userId })
        });
        const data = await response.json();

        if (data.success) {
          setUserPosts(data.data.userPosts || []);
          setSavedPosts(data.data.savedPosts || []);
        } else {
          setPostsError("Failed to load posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostsError(error.response?.data?.error || "Failed to load posts");
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoadingChats(true);
        setChatsError(null);

        const response = await apiRequest.get("/chats");
        setChats(response.data.data || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatsError(error.response?.data?.error || "Failed to load chats");
        setChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">My Dashboard</h1>
          <p className="text-stone-600">Manage your properties and messages</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <div className="text-center mb-6">
                <img 
                  src={currentUser.avatar || "/default-avatar.webp"} 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-amber-200 mb-4"
                />
                <h2 className="text-2xl font-bold text-stone-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-amber-700 font-semibold mt-1">Property Owner</p>
              </div>

              <div className="space-y-3 py-6 border-y-2 border-stone-200 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-1">Email</p>
                  <p className="text-stone-900 font-medium">{currentUser.email}</p>
                </div>
                {currentUser.phoneNumber && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-1">Phone</p>
                    <p className="text-stone-900 font-medium">{currentUser.phoneNumber}</p>
                  </div>
                )}
                {currentUser.region && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-1">Region</p>
                    <p className="text-stone-900 font-medium">{currentUser.region}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link to="/profile/update" className="block">
                  <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wide">
                    Edit Profile
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-stone-200 hover:bg-stone-300 text-stone-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wide"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* My Posts Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">My Properties</h2>
                  <p className="text-stone-600 text-sm mt-1">{userPosts.length} properties listed</p>
                </div>
                <Link to="/add">
                  <button className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 uppercase text-sm tracking-wide">
                    + New Property
                  </button>
                </Link>
              </div>
              
              {isLoadingPosts ? (
                <div className="py-12 text-center">
                  <div className="w-10 h-10 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-stone-600">Loading properties...</p>
                </div>
              ) : postsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold">Error: {postsError}</p>
                </div>
              ) : userPosts.length > 0 ? (
                <div>
                  <List posts={userPosts} setPosts={setUserPosts} isOwnerView={true} />
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-stone-600 text-lg mb-4">No properties yet</p>
                  <Link to="/add">
                    <button className="text-amber-700 hover:text-amber-800 font-semibold">
                      Create your first property listing →
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Saved Posts Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Saved Properties</h2>
                <p className="text-stone-600 text-sm mt-1">{savedPosts.length} properties saved</p>
              </div>
              
              {isLoadingPosts ? (
                <div className="py-12 text-center">
                  <div className="w-10 h-10 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-stone-600">Loading saved properties...</p>
                </div>
              ) : postsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold">Error: {postsError}</p>
                </div>
              ) : savedPosts.length > 0 ? (
                <List posts={savedPosts} setPosts={setSavedPosts} isOwnerView={false} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-stone-600">No saved properties yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">Messages</h2>
          
          {isLoadingChats ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-stone-600">Loading messages...</p>
            </div>
          ) : chatsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold">Error: {chatsError}</p>
            </div>
          ) : (
            <Chat chats={chats} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
