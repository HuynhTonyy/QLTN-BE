const router = require("express").Router()
const User = require("../models/User")
const ROLES = require("../constants/roles")
const { protect, authorize } = require("../middleware/authMiddleWare")
const status = require("../constants/status")

router.use(protect, authorize(ROLES.ADMIN))
router.get("/pending", async (req, res) => {
  const users = await User.find({
    status: status.PENDING,
    isVerified: true
  }).select("-password")

  res.json(users)
})
router.get("/", async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.user.id },
       status: status.ACTIVE,
        isVerified: true
    }).select("-password")

    res.json(users)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})
router.patch("/:id", async (req, res) => {
  try {
    const { username, role } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        role,
      },
      { new: true, runValidators: true }
    )
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: err })
  }
})
router.patch("/:id/accept", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: status.ACTIVE })
  res.json({ message: "User accepted" })
})
router.delete

// routes/admin.js
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const pendingUsers = await User.countDocuments({ status: status.PENDING })

    res.json({
      totalUsers,
      pendingUsers,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})
module.exports = router