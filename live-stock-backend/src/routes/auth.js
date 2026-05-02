import express  from "express"
import {  getAdminStats, loginUserController, logoutUserController, getUserProfileController } from "../controllers/authController.js"
import { createUserController, getBranchStaffController, getAllUsersController, updateUserController, deleteUserController, blockUserController } from "../controllers/authController.js"
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/auth.js";
import { createBranchController, deleteBranchController, getBranchController, updateBranchController, getBranchCapacityController } from "../controllers/branchController.js";
import { isManager } from "../middleware/isManager.js";

let router = express.Router();


// -----------------Login--------------------------
router.post("/auth", loginUserController)
router.get("/profile", verifyToken, getUserProfileController)

// -----------------Logout--------------------------
router.post("/logout", verifyToken, logoutUserController);

// -----------------Dashboard Data (Unified)------------
router.get("/getStats", verifyToken, getAdminStats);


// -----------------branch--------------------------
router.post("/create-user", verifyToken, isAdmin, createUserController);
router.get("/all-users", verifyToken, isAdmin, getAllUsersController);
router.put("/update-user/:id", verifyToken, isAdmin, updateUserController);
router.delete("/delete-user/:id", verifyToken, isAdmin, deleteUserController);
router.patch("/block-user/:id", verifyToken, isAdmin, blockUserController);
router.get("/branch-staff", verifyToken, isManager, getBranchStaffController);
router.post("/branch-create", verifyToken, isAdmin, createBranchController);

// -----------------Staff--------------------------
router.get("/branch-staff", verifyToken, isManager, getBranchStaffController);

router.post("/branch-create", verifyToken, isAdmin, createBranchController);
router.get("/branch-get", verifyToken, isAdmin, getBranchController);
router.get("/branch-capacity", verifyToken, isAdmin, getBranchCapacityController);
router.delete("/branch-delete/:id", verifyToken, isAdmin, deleteBranchController);
router.put("/branch-update/:id", verifyToken, isAdmin, updateBranchController);

// -----------------manager--------------------------
router.post("/create-user", verifyToken, isAdmin, createUserController);



export default router