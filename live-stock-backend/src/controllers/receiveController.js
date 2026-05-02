import Allocation from "../models/Allocation.js";
import Inventory from "../models/inventoryModel.js";

// reciveController.js
export const receivedAnimals = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const { receivedAnimals, status } = req.body;
    const allocation = await Allocation.findById(allocationId);
    console.log(allocation);

    if (!allocation) {
      return res.status(404).send({
        success: false,
        message: "Allocation not found",
      });
    }

    if (allocation.status === "Received") {
      return res.status(400).send({
        success: false,
        message: "Animals already received for this allocation",
      });
    }

    allocation.receivedAnimals = receivedAnimals;
    allocation.status = status || "Received";
    await allocation.save();

    // Update Branch Inventory
    let inventory = await Inventory.findOne({ branchId: allocation.branchId });

    if (!inventory) {
      await Inventory.create({
        branchId: allocation.branchId,
        totalAnimalsReceived: Number(receivedAnimals),
        totalSlaughtered: 0,
        meatStock: 0,
        skinStock: 0,
        payeStock: 0,
      });
    } else {
      inventory.totalAnimalsReceived += Number(receivedAnimals);
      await inventory.save();
    }

    res.status(200).send({
      success: true,
      message: "Animals received successfully and Inventory updated",
      data: allocation,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error receiving Animals",
      error: error.message,
    });
  }
};
