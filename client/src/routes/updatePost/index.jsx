import { useState, useEffect } from "react";
import "../newPostPage/newPostPage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [postType, setPostType] = useState("rent");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    desc: "",
    city: "",
    bedroom: "",
    bathroom: "",
    latitude: "",
    longitude: "",
    type: "rent",
    property: "apartment",
    rentalPeriod: "",
    rentalDuration: "",
    utilities: "owner",
    pet: "allowed",
    income: "",
    size: "",
    school: "",
    bus: "",
    restaurant: "",
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${id}`
        );
        const data = await response.json();
        console.log("Fetched post data:", data);
        if (data.success) {
          const post = data.data;
          
          // Set form data
          setFormData({
            title: post.title || "",
            price: post.price || "",
            address: post.address || "",
            desc: post?.description || "",
            city: post.city || "",
            bedroom: post.bedroom || "",
            bathroom: post.bathroom || "",
            latitude: post.latitude || "",
            longitude: post.longitude || "",
            type: post.type || "rent",
            property: post.property || "apartment",
            rentalPeriod: post.rentalPeriod || "",
            rentalDuration: post.rentalDuration || "",
            utilities: post.postDetail?.utilities || "owner",
            pet: post.postDetail?.pet || "allowed",
            income: post.postDetail?.income || "",
            size: post.postDetail?.size || "",
            school: post.postDetail?.school || "",
            bus: post.postDetail?.bus || "",
            restaurant: post.postDetail?.restaurant || "",
          });          
          // Set images
          setImages(post.images || []);
          
          // Set post type
          setPostType(post.type || "rent");
        } else {
          setError("Post not found");
          setTimeout(() => navigate("/profile"), 2000);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data");
        setTimeout(() => navigate("/profile"), 2000);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "type") {
      setPostType(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation for rental fields
    if (formData.type === "rent") {
      if (!formData.rentalPeriod) {
        setError("Please select a rental period");
        setIsLoading(false);
        return;
      }
      if (!formData.rentalDuration || parseInt(formData.rentalDuration) < 1) {
        setError("Please enter a valid rental duration (minimum 1)");
        setIsLoading(false);
        return;
      }
    }

    try {
      const postData = {
        title: formData.title,
        price: parseInt(formData.price),
        address: formData.address,
        city: formData.city,
        bedroom: parseInt(formData.bedroom),
        bathroom: parseInt(formData.bathroom),
        type: formData.type,
        property: formData.property,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: images,
        description: formData.desc,
        utilities: formData.utilities,
        pet: formData.pet,
        income: formData.income,
        size: parseInt(formData.size),
        school: parseInt(formData.school),
        bus: parseInt(formData.bus),
        restaurant: parseInt(formData.restaurant),
      };

      // Add rental-specific fields only if type is rent
      if (formData.type === "rent") {
        postData.rentalPeriod = formData.rentalPeriod;
        postData.rentalDuration = parseInt(formData.rentalDuration);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ postData }),
        }
      );

      const res = await response.json();

      if (res.success) {
        navigate("/" + id);
      } else {
        setError(res.error || "Failed to update post");
      }
    } catch (err) {
      console.error("Post update error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="newPostPage">
        <div className="formContainer">
          <div className="wrapper" style={{ textAlign: "center", padding: "50px" }}>
            <div className="w-12 h-12 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading post data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Update Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={0}
                id="bedroom"
                name="bedroom"
                type="number"
                value={formData.bedroom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={0}
                id="bathroom"
                name="bathroom"
                type="number"
                value={formData.bathroom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            {/* Rental-specific fields - only show if type is rent */}
            {postType === "rent" && (
              <>
                <div className="item">
                  <label htmlFor="rentalPeriod">Rental Period</label>
                  <select
                    name="rentalPeriod"
                    value={formData.rentalPeriod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select period</option>
                    <option value="day">Per Day</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="rentalDuration">
                    Rental Duration (number of periods)
                  </label>
                  <input
                    id="rentalDuration"
                    name="rentalDuration"
                    type="number"
                    min="1"
                    value={formData.rentalDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 for 6 months"
                    required
                  />
                </div>
              </>
            )}

            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                name="property"
                value={formData.property}
                onChange={handleInputChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                name="utilities"
                value={formData.utilities}
                onChange={handleInputChange}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select
                name="pet"
                value={formData.pet}
                onChange={handleInputChange}
              >
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                value={formData.income}
                onChange={handleInputChange}
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input
                min={0}
                id="size"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="school">School Distance (km)</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                value={formData.school}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Distance (km)</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                value={formData.bus}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant Distance (km)</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                value={formData.restaurant}
                onChange={handleInputChange}
              />
            </div>
            <button className="sendButton" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Post"}
            </button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default UpdatePostPage;