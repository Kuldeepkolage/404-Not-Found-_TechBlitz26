const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const appointmentRoutes = require("./routes/appointmentRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(
  "mongodb+srv://ninad233374105_db_user:Zlucoocrt39BNxXs@cluster0.6fcbbnj.mongodb.net/clinic?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/appointments", appointmentRoutes)

app.listen(5000,()=>{
    console.log("Server running on port 5000")
})

const authRoutes = require("./routes/authRoutes")

app.use("/auth",authRoutes)

require("dotenv").config()