import Allocation from "../models/Allocation.js";
import Branch from "../models/Branch.js";

// -----------------Create Branch--------------------------
export const createBranchController = async (req, res) => {
  try {
    const { name, location, capacity, managerId } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Branch name aur location dena zaroori hai!",
      });
    }

    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Is naam ki branch pehle se majood hai!",
      });
    }

    const newBranch = await Branch.create({
      name,
      location,
      capacity: capacity || 500,
      managerId: managerId || null
    });

    res.status(201).json({
      success: true,
      message: "Branch successfully create ho gayi!",
      data: newBranch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Get Branch--------------------------
export const getBranchController = async (req, res) => {
  try {
    const branches = await Branch.find().populate("managerId", "username email");

    if (!branches) {
      return res.status(404).json({
        success: false,
        message: "Branch Not Avaiable"
      })
    }
    res.status(200).json({
      success: true,
      branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Update Branch--------------------------
export const updateBranchController = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, location, capacity, managerId } = req.body; 

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch nahi mili!",
      });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name || branch.name,
          location: location || branch.location,
          capacity: capacity || branch.capacity,
          managerId: managerId === "" ? null : (managerId || branch.managerId)
        },
      },
      { new: true } 
    ).populate("managerId", "username email");

    res.status(200).json({
      success: true,
      message: "Branch details update ho gayi hain",
      data: updatedBranch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Branch update karne mein error aya",
      error: error.message,
    });
  }
};

// -----------------Delete Branch--------------------------
export const deleteBranchController = async (req, res) => {
  try {
    const { id } = req.params;

    const hasAllocations = await Allocation.findOne({ branchId: id });
    if (hasAllocations) {
      return res.status(400).json({
        success: false,
        message: "Pehle is branch ki allocations delete karein, phir branch delete hogi."
      });
    }

    await Branch.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------Get Branch Capacity--------------------------
export const getBranchCapacityController = async (req, res) => {
  try {
    const branches = await Branch.find({}, 'name capacity');
    const allocations = await Allocation.aggregate([
      {
        $group: {
          _id: "$branchId",
          totalAllocated: { $sum: "$quantity" }
        }
      }
    ]);

    const capacityData = branches.map(branch => {
      const allocation = allocations.find(a => a._id.toString() === branch._id.toString());
      return {
        _id: branch._id,
        name: branch.name,
        capacity: branch.capacity || 500,
        allocated: allocation ? allocation.totalAllocated : 0
      };
    });

    res.status(200).json({
      success: true,
      data: capacityData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
