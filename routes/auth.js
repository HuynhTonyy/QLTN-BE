const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Register
const crypto = require("crypto")
const sendVerificationEmail = require("../utils/sendEmail")
const { protect, adminOnly } = require("../middleware/authMiddleWare")

router.get("/admin-data", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome admin" })
})

router.post("/register", async (req, res) => {
  try {
    console.log("Start register")
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    console.log("After findOne")
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng!" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const token = crypto.randomBytes(32).toString("hex")

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "DQ", 
      verificationToken: token,
      verificationExpires: new Date(Date.now() + 5 * 60 * 1000)
    })
    await newUser.save()
    console.log("User saved")

sendVerificationEmail(email, token)
  .then(() => console.log("Email success"))
  .catch(async (err) => {
    console.error("Email failed:", err)
    await User.deleteOne({ email })
  })




    // sendVerificationEmail(email, token).catch(async (err) => {
    //   console.error("Email failed:", err)
    //   await User.deleteOne({ email })
    // })
    res.json({ message: "Email xác thực đã được gửi." })

  }catch (err) {
  console.error("REGISTER ERROR:", err)
  res.status(500).json({ message: err.message })
}

})
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpires: { $gt: Date.now() }
    })
    
    if (!user) {
      return res.status(400).send("Đường dẫn xác thực quá hạn hoặc không hợp lệ.")
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationExpires = undefined

    await user.save()

    res.send("Tài khoản xác minh thành công!")

  } catch (err) {
    res.status(500).send("Lỗi server!")
  }
})



module.exports = router
    