import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function SinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${id}`
        );
        const data = await res.json();

        if (data.success) {
          setPost(data.data);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg font-medium">Loading...</div>
      </div>
    );
  
  if (error) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  
  if (!post) return null;

  const isOwner =
    currentUser && post.user && post.user._id === currentUser._id;

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) 
    return (
      <div className="h-[100dvh] overflow-y-scroll flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 text-lg font-medium">Loading property...</p>
        </div>
      </div>
    );
  
  if (error) 
    return (
      <div className="h-[100dvh] overflow-y-scroll flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="text-amber-700 hover:text-amber-800 font-medium">
            Go back
          </button>
        </div>
      </div>
    );

  return (
    <div className="h-[100dvh] overflow-y-scroll bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Large Image Slider */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-96 lg:h-[500px]">
              <Slider images={post.images} />
            </div>
          </div>

          {/* Right Column - Property Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              {/* Title */}
              <h1 className="text-3xl font-bold text-stone-900 mb-2 line-clamp-3 leading-tight">
                {post.title}
              </h1>
              <p className="text-amber-700 font-semibold mb-6">{post.type === "rent" ? "For Rent" : "For Sale"}</p>

              {/* Price Highlight */}
              <div className="mb-8 pb-8 border-b-2 border-stone-200">
                <p className="text-5xl font-bold text-amber-700 mb-1">
                  ${post.price.toLocaleString()}
                </p>
                {post.type === "rent" && (
                  <p className="text-stone-600 text-sm font-medium">
                    per {post.rentalPeriod}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <div
                  className="text-stone-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.description || ""),
                  }}
                />
              </div>

              {/* Owner Card */}
              <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-5 mb-8 border border-amber-100">
                <p className="text-xs uppercase tracking-widest text-stone-600 font-semibold mb-3">Property Owner</p>
                <div className="flex items-center gap-4">
                  <img
                    src={post.user.avatar || "/default-avatar.webp"}
                    alt={`${post.user.firstName} ${post.user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-200"
                  />
                  <div>
                    <p className="font-bold text-stone-900">
                      {post.user.firstName} {post.user.lastName}
                    </p>
                    <p className="text-sm text-stone-600">Verified Owner</p>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-stone-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wide"
                >
                  {isDeleting ? "Deleting..." : "Delete Listing"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">Key Features</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { label: "Bedrooms", value: post.bedroom, icon: "🛏️" },
              { label: "Bathrooms", value: post.bathroom, icon: "🚿" },
              { label: "Size", value: post.size ? `${post.size} sqft` : "N/A", icon: "📐" },
              { label: "Pets", value: post.pet, icon: "🐾" },
              { label: "Utilities", value: post.utilities, icon: "⚡" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-5 border border-amber-100 text-center hover:shadow-lg transition-shadow duration-200">
                <p className="text-2xl mb-2">{feature.icon}</p>
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                  {feature.label}
                </p>
                <p className="text-2xl font-bold text-amber-700">{feature.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Nearby Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "🏫 School", value: post.school },
                { label: "🚌 Bus Stop", value: post.bus },
                { label: "🍽️ Restaurant", value: post.restaurant },
                { label: "💰 Income Required", value: post.income },
              ].map((amenity, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-stone-900 font-semibold mb-1">{amenity.label}</span>
                  <span className="text-amber-700 font-bold">
                    {amenity.value ? `${amenity.value} km` : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b-2 border-stone-200 bg-gradient-to-r from-amber-50 to-transparent">
            <h2 className="text-2xl font-bold text-stone-900">Property Location</h2>
            <p className="text-stone-600 text-sm mt-1">View the exact location on the map below</p>
          </div>
          <div className="h-96 lg:h-[450px]">
            <Map items={[post]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
