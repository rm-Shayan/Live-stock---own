import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Branch from "../models/Branch.js";
import Inventory from "../models/inventoryModel.js";
import Allocation from "../models/Allocation.js";
import Batch from "../models/Batch.js";

// ----------------------Login--------------------------
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(403).json({
        success: false,
        message: "Wrong Password",
      });

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact admin.",
      });
    }

    const payload = { id: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "development" ? "lax" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully!",
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------Logout--------------------------
export const logoutUserController = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout mein error aya",
    });
  }
};
// ----------------------Create manager------------------
export const createUserController = async (req, res) => {
  try {
    const { username, email, password, role, branchId } = req.body;

    console.log(username, email, password, role);

    if (!username || !email || !password || !role) {
      return res.status(404).json({
        success: false,
        message: "All fields required",
      });
    }
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      branchId: branchId || null,
    });

    if (!createUser) {
      return res.status(400).json({
        success: false,
        message: "create user error",
      });
    }

    res.status(200).json({
      success: true,
      message: `Create ${username} ${role} Successfully`,
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------Get All Data--------------------------
export const getAdminStats = async (req, res) => {
  try {
    const isManagerRole = req.user.role === "manager";
    const userBranchId = req.user.branchId;

    let warehouse = { totalAnimalsInSystem: 0, availableInMainStock: 0, totalSentToBranches: 0 };
    let globalInventory = { totalSlaughtered: 0, totalMeatInStock: 0, totalSkinsInStock: 0, totalPayeInStock: 0 };
    let branchWiseReport = [];
    let statusCounts = { pending: 0, received: 0 };

    if (!isManagerRole) {
      // Logic for ADMIN: Global Stats
      const batchStats = await Batch.aggregate([
        { $group: { _id: null, totalPurchased: { $sum: "$TotalAnimals" }, totalRemaining: { $sum: "$remainingAnimals" } } },
      ]);

      const globalInv = await Inventory.aggregate([
        { $group: { _id: null, totalMeat: { $sum: "$meatStock" }, totalSlaughtered: { $sum: "$totalSlaughtered" }, totalSkins: { $sum: "$skinStock" }, totalPaye: { $sum: "$payeStock" } } },
      ]);

      branchWiseReport = await Branch.aggregate([
        { 
          $lookup: { 
            from: "inventories", 
            localField: "_id", 
            foreignField: "branchId", 
            as: "inventoryDetails" 
          } 
        },
        { $unwind: { path: "$inventoryDetails", preserveNullAndEmptyArrays: true } },
        { 
          $project: { 
            _id: 0, 
            branchName: "$name", 
            animalsSlaughtered: { $ifNull: ["$inventoryDetails.totalSlaughtered", 0] }, 
            currentMeatStock: { $ifNull: ["$inventoryDetails.meatStock", 0] }, 
            currentSkinStock: { $ifNull: ["$inventoryDetails.skinStock", 0] }, 
            currentPayeStock: { $ifNull: ["$inventoryDetails.payeStock", 0] }, 
            totalReceived: { $ifNull: ["$inventoryDetails.totalAnimalsReceived", 0] } 
          } 
        },
      ]);

      const totalSentOut = branchWiseReport.reduce((acc, curr) => acc + curr.totalReceived, 0);

      warehouse = {
        totalAnimalsInSystem: batchStats[0]?.totalPurchased || 0,
        availableInMainStock: batchStats[0]?.totalRemaining || 0,
        totalSentToBranches: totalSentOut,
      };

      globalInventory = {
        totalSlaughtered: globalInv[0]?.totalSlaughtered || 0,
        totalMeatInStock: globalInv[0]?.totalMeat || 0,
        totalSkinsInStock: globalInv[0]?.totalSkins || 0,
        totalPayeInStock: globalInv[0]?.totalPaye || 0,
      };

      statusCounts = {
        pending: await Allocation.countDocuments({ status: "Pending" }),
        received: await Allocation.countDocuments({ status: "Received" }),
      };
    } else {
      // Logic for MANAGER: Branch Specific Stats
      if (!userBranchId) return res.status(403).json({ success: false, message: "No branch assigned to this manager" });

      const branch = await Branch.findById(userBranchId);
      const branchInv = await Inventory.findOne({ branchId: userBranchId });
      
      branchWiseReport = [{
        branchName: branch?.name || "My Branch",
        animalsSlaughtered: branchInv?.totalSlaughtered || 0,
        currentMeatStock: branchInv?.meatStock || 0,
        currentSkinStock: branchInv?.skinStock || 0,
        currentPayeStock: branchInv?.payeStock || 0,
        totalReceived: branchInv?.totalAnimalsReceived || 0,
      }];

      globalInventory = {
        totalSlaughtered: branchInv?.totalSlaughtered || 0,
        totalMeatInStock: branchInv?.meatStock || 0,
        totalSkinsInStock: branchInv?.skinStock || 0,
        totalPayeInStock: branchInv?.payeStock || 0,
      };

      statusCounts = {
        pending: await Allocation.countDocuments({ branchId: userBranchId, status: "Pending" }),
        received: await Allocation.countDocuments({ branchId: userBranchId, status: "Received" }),
      };
    }

    res.status(200).json({
      success: true,
      data: {
        warehouse,
        globalInventory,
        branchWiseReport,
        statusCounts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBranchStaffController = async (req, res) => {
  try {
    const branchId = req.user.branchId;
    const staff = await User.find({ branchId, role: "staff" }).select(
      "-password",
    );
    console.log("staff ===> ", staff);
    res.status(200).json({
      success: true,
      message: "Branch staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find().populate('branchId', 'name').select('-password');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------Update User--------------------------
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, branchId, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updateData = {
      username: username || user.username,
      email: email || user.email,
      role: role || user.role,
      branchId: branchId !== undefined ? branchId : user.branchId,
      isBlocked: req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------Block / Unblock User--------------------------
export const blockUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User has been ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      data: { _id: user._id, isBlocked: user.isBlocked },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------Delete User--------------------------
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ----------------------Get Current User Profile--------------------------
export const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("branchId", "name location");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
