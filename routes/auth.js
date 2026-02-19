const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Register
const crypto = require("crypto")
const sendVerificationEmail = require("../utils/sendEmail")

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const token = crypto.randomBytes(32).toString("hex")

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationExpires: Date.now() + 3 * 60 * 1000 // 3 minutes
    })
    await newUser.save()

    try {
      await sendVerificationEmail(email, token)
    } catch (err) {
      await User.deleteOne({ email })
      return res.status(500).json({ message: "Email failed" })
    }


    res.json({ message: "Verification email sent" })

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpires: { $gt: Date.now() }
    })
    
    if (!user) {
      return res.status(400).send("Verification link expired or invalid")
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationExpires = undefined

    await user.save()

    res.send("Account verified successfully")

  } catch (err) {
    res.status(500).send("Server error")
  }
})



module.exports = router
    