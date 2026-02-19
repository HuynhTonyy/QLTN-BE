const SibApiV3Sdk = require("sib-api-v3-sdk")

const client = SibApiV3Sdk.ApiClient.instance
const apiKey = client.authentications["api-key"]
apiKey.apiKey = process.env.BREVO_API_KEY

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi()

const sendVerificationEmail = async (email, token) => {
  console.log("BREVO KEY:", process.env.BREVO_API_KEY)

  try {
    const verificationLink = `https://qltn-be.onrender.com/api/auth/verify/${token}`

    const emailData = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "Quản Lý Thanh Niên"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Xác minh tài khoản Quản Lý Thanh Niên",
      htmlContent: `
        <h2>Xác minh email</h2>
        <p>Nhấn vào đường dẫn phía dưới để xác minh tài khoản:</p>
        <a href="${verificationLink}" 
          style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none;">
          Xác minh tài khoản
        </a>
        <p>Đường dẫn này sẽ hết hiệu lực sau 5 phút.</p>
      `
    }

    await emailApi.sendTransacEmail(emailData)

    console.log("Email sent successfully with Brevo")

  } catch (error) {
    console.error("Brevo error:", error.response?.body || error.message)
  }
}

module.exports = sendVerificationEmail
