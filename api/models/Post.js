import mongoose from "mongoose";

const TYPE = ["rent", "sale"];
const PROPERTY = ["apartment", "house", "land", "condo"];
const RENTAL_PERIOD = ["day", "week", "month", "year"];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    images: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    bedroom: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms must be 0 or more"],
    },
    bathroom: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms must be 0 or more"],
    },
    latitude: {
      type: String,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: String,
      required: [true, "Longitude is required"],
    },
    type: {
      type: String,
      enum: TYPE,
      required: [true, "Type is required"],
    },
    property: {
      type: String,
      enum: PROPERTY,
      required: [true, "Property type is required"],
    },
    // Rental-specific fields
    rentalPeriod: {
      type: String,
      enum: RENTAL_PERIOD,
      required: function() {
        return this.type === "rent";
      },
    },
    rentalDuration: {
      type: Number,
      min: [1, "Rental duration must be at least 1"],
      required: function() {
        return this.type === "rent";
      },
    },
    // Additional details
    utilities: {
      type: String,
      enum: ["owner", "tenant", "shared"],
      default: "tenant",
    },
    pet: {
      type: String,
      enum: ["allowed", "not-allowed"],
      default: "not-allowed",
    },
    income: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      min: [0, "Size must be positive"],
    },
    school: {
      type: Number,
      min: [0, "School distance must be positive"],
    },
    bus: {
      type: Number,
      min: [0, "Bus distance must be positive"],
    },
    restaurant: {
      type: Number,
      min: [0, "Restaurant distance must be positive"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    isSaved:{
      type: Boolean,
      default: false,
      required: true,
    }
  },
  { timestamps: true }
);

// Index for better query performance
postSchema.index({ city: 1, type: 1, property: 1 });
postSchema.index({ user: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for calculating total rental price
postSchema.virtual("totalRentalPrice").get(function() {
  if (this.type !== "rent" || !this.rentalDuration) {
    return null;
  }
  return this.price * this.rentalDuration;
});

// Method to check if user is the owner
postSchema.methods.isOwner = function(userId) {
  return this.user.toString() === userId.toString();
};

export default mongoose.model("Post", postSchema);