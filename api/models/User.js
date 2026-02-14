import mongoose from "mongoose";
import bcrypt from "bcrypt";

const NotificationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const History = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    }, {
    timestamps: true
});
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      default: null
    },
    firstName: {
      type: String,
      required: [false, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [false, "Last Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    region:{
      type:String,
      required:false,
    },
    avatar: {
      type: String,
      default: `/default-avatar.webp`,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["client", "agent", "admin"],
    },
    chatIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    notificationTokens: [NotificationSchema],
    refreshToken: { type: String },
    history: [History],
  },
  { timestamps: true }
);

// Hash password before saving user document
userSchema.pre("save", async function () {
  console.log("Pre-save hook - subscriptionPlan:", this.subscriptionPlan);
  console.log("Is subscriptionPlan defined?", this.subscriptionPlan !== undefined);
  console.log("subscriptionPlan type:", typeof this.subscriptionPlan);

  console.log(this.isModified("password"))
  if (!this.isModified("password")) return; // Remove next() here

  console.log("passed the test of modifiying")

  try {
    console.log("Password to hash:", this.password);
    console.log("Password type:", typeof this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    console.log(this.password)

    if (!this.trialStartDate) {
      this.trialStartDate = new Date();
    }
    if (!this.trialEndDate) {
      this.trialEndDate = new Date(this.trialStartDate);
      this.trialEndDate.setDate(this.trialEndDate.getDate() + 7);
    }

    console.log("saved the user successfuly")
    // Remove next() here - async functions don't need it
  } catch (error) {
    console.log(error)
    throw error; // Throw the error instead of calling next(error)
  }
});
// Compare provided password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
  console.log("Comparing:", password, "with hash:", this.password);
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
