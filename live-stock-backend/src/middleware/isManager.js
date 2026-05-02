export const isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ 
      success: false,
      message: "access denied only manager allowedd!",
    });
  }
  next();
};