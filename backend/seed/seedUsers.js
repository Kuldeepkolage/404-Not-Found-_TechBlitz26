require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("../models/User")

mongoose.connect(
process.env.MONGO_URI
)

async function seed(){

 const password = await bcrypt.hash("123456",10)

 await User.create({
  name:"Dr Sharma",
  email:"doctor@test.com",
  password,
  role:"doctor"
 })

 await User.create({
  name:"Reception",
  email:"reception@test.com",
  password,
  role:"receptionist"
 })

 console.log("Users seeded")

 process.exit()
}

seed()