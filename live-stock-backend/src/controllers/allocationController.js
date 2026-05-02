import Allocation from "../models/Allocation.js";
import Batch from "../models/Batch.js";

// -----------------Create Allocation--------------------------
export const allocationController = async (req, res) => {
  try {
    const { batchId, branchId, quantity } = req.body;

    if (!batchId || !branchId || !quantity) {
      return res.status(404).json({
        success: false,
        message: "All field Requied!",
      });
    }

    const batch = await Batch.findById(batchId);
    console.log(batch);
    
    if (!batch) {
      return res.status(403).json({
        success: false,
        message: "Batch Id Invalid",
      });
    }
    if (batch.remainingAnimals < quantity) {
      return res.status(400).json({
        success: false,
        message: "itne bakre stock me nahi hai!",
      });
    }

    batch.remainingAnimals -= quantity;
    await batch.save();

    const allocation = await Allocation.create({
      batchId,
      branchId,
      quantity,
      status: "Pending",
    });
    res.status(200).json({
      success: true,
      message: "Create Allocation Successfully!",
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------delete Allocation--------------------------
export const deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    
    const allocation = await Allocation.findById(id);
    console.log(allocation);
    
    if (!allocation) {
      return res.status(404).json({ success: false, message: "Allocation not found" });
    }

    
    if (allocation.status === "Received") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete! Manager has already received these animals.",
      });
    }

    
    
    await Batch.findByIdAndUpdate(allocation.batchId, {
      $inc: { remainingAnimals: allocation.quantity } 
    });

    
    await Allocation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Allocation cancelled and stock returned to Batch successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate('batchId', 'BatchNum')
      .populate('branchId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: allocations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------Update Allocation--------------------------
export const updateAllocationController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quantity, branchId } = req.body;

    const allocation = await Allocation.findById(id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: "Allocation not found" });
    }

    if (allocation.status === "Received" && (quantity || branchId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot modify quantity or branch after allocation has been received." 
      });
    }

    // Handle Quantity Change (Adjust Batch Stock)
    if (quantity !== undefined && quantity !== allocation.quantity) {
      const batch = await Batch.findById(allocation.batchId);
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

      const diff = quantity - allocation.quantity;
      if (batch.remainingAnimals < diff) {
        return res.status(400).json({ success: false, message: "Not enough animals in stock for this change" });
      }

      batch.remainingAnimals -= diff;
      await batch.save();
      allocation.quantity = quantity;
    }

    if (branchId) allocation.branchId = branchId;
    if (status) allocation.status = status;

    await allocation.save();

    const updatedAllocation = await Allocation.findById(id)
      .populate('batchId', 'BatchNum')
      .populate('branchId', 'name');

    res.status(200).json({
      success: true,
      message: "Allocation updated successfully",
      data: updatedAllocation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};