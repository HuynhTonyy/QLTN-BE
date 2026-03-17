const router = require("express").Router()
const User = require("../models/User")
const ROLES = require("../constants/roles")
const { protect, authorize } = require("../middleware/authMiddleWare")

router.use(protect, authorize(ROLES.ADMIN))
router.get("/users/pending", async (req, res) => {
  const users = await User.find({
    isAccepted: false,
    isVerified: true
  }).select("-password")

  res.json(users)
})
router.get("/users", async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.user.id },
       isAccepted: true,
        isVerified: true
    }).select("-password")

    res.json(users)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

router.patch("/users/:id/accept", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isAccepted: true })
  res.json({ message: "User accepted" })
})

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body
  await User.findByIdAndUpdate(req.params.id, { role })
  res.json({ message: "Role updated" })
})

module.exports = router