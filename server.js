require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser");

const app = express()
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://qltn.vercel.app"
  ],
  credentials: true
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.use("/api/auth", require("./routes/auth"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

