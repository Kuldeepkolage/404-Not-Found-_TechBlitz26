const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("../models/User")

mongoose.connect(
"mongodb+srv://ninad233374105_db_user:Zlucoocrt39BNxXs@cluster0.6fcbbnj.mongodb.net/clinic?retryWrites=true&w=majority"
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