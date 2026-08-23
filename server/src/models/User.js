const { mongoose } = require("../config/database");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, maxlength: 80 },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, collection: "users" },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
