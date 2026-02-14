import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState("rent"); // Track post type

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validation for rental fields
    if (inputs.type === "rent") {
      if (!inputs.rentalPeriod) {
        setError("Please select a rental period");
        setIsLoading(false);
        return;
      }
      if (!inputs.rentalDuration || parseInt(inputs.rentalDuration) < 1) {
        setError("Please enter a valid rental duration (minimum 1)");
        setIsLoading(false);
        return;
      }
    }

    try {
      const postData = {
        title: inputs.title,
        price: parseInt(inputs.price),
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedroom),
        bathroom: parseInt(inputs.bathroom),
        type: inputs.type,
        property: inputs.property,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        images: images,
        description: inputs.description,
        utilities: inputs.utilities,
        pet: inputs.pet,
        income: inputs.income,
        size: parseInt(inputs.size),
        school: parseInt(inputs.school),
        bus: parseInt(inputs.bus),
        restaurant: parseInt(inputs.restaurant),
      };

      // Add rental-specific fields only if type is rent
      if (inputs.type === "rent") {
        postData.rentalPeriod = inputs.rentalPeriod;
        postData.rentalDuration = parseInt(inputs.rentalDuration);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },

        body: JSON.stringify({ postData }),
      });

      const res = await response.json();

      if (res.success) {
        navigate("/" + res.data._id);
      } else {
        setError(res.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" min="0" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={0}
                id="bedroom"
                name="bedroom"
                type="number"
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
                required
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
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
                  <select name="rentalPeriod" required>
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
                    placeholder="e.g., 6 for 6 months"
                    required
                  />
                </div>
              </>
            )}

            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
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
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School Distance (km)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Distance (km)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant Distance (km)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Post"}
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

export default NewPostPage;