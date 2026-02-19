const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `https://qltn-be.onrender.com/api/auth/verify/${token}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Xác minh tài khoản Quản Lý Thanh Niên`,
      html: `
        <h2>Xác minh email</h2>
        <p>Nhấn vào đường dẫn phía dưới để xác minh tài khoản:</p>
        <a href="${verificationLink}" 
          style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none;">
          Xác minh tài khoản
        </a>
        <p>Đường dẫn này sẽ hết hiệu lực sau 5 phút.</p>
      `
    })

    console.log("Email sent successfully")
  } catch (error) {
    console.error("Email sending failed:", error)
  }
}


module.exports = sendVerificationEmail
