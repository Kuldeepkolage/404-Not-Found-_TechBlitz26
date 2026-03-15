export const allowDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied - Doctor only" });
  }
  next();
};

export const allowReceptionist = (req, res, next) => {
  if (req.user.role !== "receptionist") {
    return res.status(403).json({ message: "Access denied - Receptionist only" });
  }
  next();
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied - Insufficient permissions" });
    }
    next();
  };
};