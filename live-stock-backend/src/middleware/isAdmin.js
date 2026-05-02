


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Sirf Admin ye kaam kar sakta hai!",
    });
  }
  next();
};
