exports.allowDoctor = (req,res,next)=>{

 if(req.user.role !== "doctor"){
  return res.status(403).json({message:"Access denied"})
 }

 next()

}

exports.allowReceptionist = (req,res,next)=>{

 if(req.user.role !== "receptionist"){
  return res.status(403).json({message:"Access denied"})
 }

 next()

}