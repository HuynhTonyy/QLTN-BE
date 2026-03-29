const router = require("express").Router()
const User = require("../models/User")
const ROLES = require("../constants/roles")
const { protect, authorize } = require("../middleware/authMiddleWare")
const status = require("../constants/status")

router.use(protect, authorize(ROLES.ADMIN))
router.get("/users/pending", async (req, res) => {
  const users = await User.find({
    status: status.PENDING,
    isVerified: true
  }).select("-password")

  res.json(users)
})
router.get("/users", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
  try {
    const { username, email, role } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        role,
      },
      { new: true, runValidators: true }
    )

    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: "Update failed" })
  }
})
router.patch("/users/:id/accept", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: status.PENDING })
  res.json({ message: "User accepted" })
})
router.delete

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body
  await User.findByIdAndUpdate(req.params.id, { role })
  res.json({ message: "Role updated" })
})
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