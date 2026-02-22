const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const USER_ROLES = ["ADMIN", "SUPER_ADMIN"];

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "ADMIN",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toJSON = function toJSON() {
  const object = this.toObject();
  delete object.passwordHash;
  return object;
};

module.exports = mongoose.model("User", UserSchema);

