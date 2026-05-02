import Batch from "../models/Batch.js";

// -----------------Create Batch--------------------------
export const createBatchController = async (req, res) => {
  try {
    const { BatchNum, TotalAnimals, Category, costPrice, supplier, ArrivalDate } = req.body;

    if (!BatchNum || !TotalAnimals || !Category) {
      return res.status(404).json({
        success: false,
        message: "All field Required!",
      });
    }

    const createBatch = await Batch.create({
      BatchNum,
      TotalAnimals,
      Category,
      remainingAnimals: TotalAnimals,
      costPrice: costPrice || 0,
      supplier: supplier || "",
      ArrivalDate: ArrivalDate || Date.now(),
    });

    res.status(200).json({
      success: true,
      message: "Create Batch Successfully!",
      data: createBatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Update Batch--------------------------
export const updateBatchController = async (req, res) => {
  try {
    const { updateId } = req.params;
    const { BatchNum, TotalAnimals, Category } = req.body;

    const existingBatch = await Batch.findById(updateId);
    if (!existingBatch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    
    let updateFields = { BatchNum, Category };

    if (TotalAnimals !== undefined) {
  
      const allocatedAnimals = existingBatch.TotalAnimals - existingBatch.remainingAnimals;

  
  
      if (TotalAnimals < allocatedAnimals) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total below ${allocatedAnimals} because they are already allocated.`,
        });
      }

      
      updateFields.TotalAnimals = TotalAnimals;
      updateFields.remainingAnimals = TotalAnimals - allocatedAnimals;
    }
  

    const update = await Batch.findByIdAndUpdate(
      updateId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Batch and Remaining Stock Updated Successfully",
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Get Batch Categories--------------------------
export const getBatchCategories = async (req, res) => {
  try {
    const enumValues = Batch.schema.path("Category").enumValues;
    res.status(200).json({
      success: true,
      data: enumValues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Get All Batches--------------------------
export const getAllBatchesController = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    const batchesWithStatus = batches.map(batch => ({
      ...batch.toObject(),
      isAllocated: batch.remainingAnimals === 0
    }));
    res.status(200).json({
      success: true,
      data: batchesWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------Delete Batch--------------------------
export const deleteBatchController = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    if (batch.TotalAnimals !== batch.remainingAnimals) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete batch with active allocations. Delete allocations first."
      });
    }

    await Batch.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};