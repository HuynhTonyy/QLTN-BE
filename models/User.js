const mongoose = require("mongoose")
const roles = require("../constants/roles")
const status = require("../constants/status")

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
    enum: [roles.ADMIN,roles.BCH,roles.BCHTQ,roles.DQ],
    default: roles.DQ
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  status:{
    type: String,
    enum: [ status.ACTIVE , status.PENDING , status.SUSPENDED],
    default: status.PENDING
  },
  isDeleted: {type: Boolean, default: false},
  deletedAt: {type: Date}
}, { timestamps: true })
UserSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("User", UserSchema)
