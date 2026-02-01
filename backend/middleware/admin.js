import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.json({ success: false, message: "User ID not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.json({ success: false, message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.json({ success: false, message: "Error verifying admin access" });
  }
};

export default adminMiddleware;
