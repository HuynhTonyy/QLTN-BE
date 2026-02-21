const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const sendVerificationEmail = require("../utils/sendEmail")
const { protect, authorize } = require("../middleware/authMiddleWare")
const generateToken = require("../utils/generateToken")




router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
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
    sendVerificationEmail(email, token)
      .catch(err => console.error(err))
    res.json({ message: "Email xác thực đã được gửi." })

  }catch (err) {
  console.error("REGISTER ERROR:", err)
  res.status(500).json({ message: err.message })
}

})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không hợp lệ." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác." })
    }

    if(!user.isAccepted){
      return res.status(400).json({ message: "Tài khoản chưa được chấp thuận. Vui lòng chờ." })
    }
    const token = generateToken(user)
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000
    });

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Server error" })
  }
})
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Đăng xuất!" });
});
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
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access" });
});


module.exports = router
    