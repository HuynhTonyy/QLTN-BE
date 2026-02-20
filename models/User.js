const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin","BCHTQ","BCH","DQ"],
    default: "DQ"
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  isAccepted: {type: String, default: false},
}, { timestamps: true })
UserSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("User", UserSchema)
