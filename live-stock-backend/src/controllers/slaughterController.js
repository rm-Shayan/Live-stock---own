import Allocation from "../models/Allocation.js";
import Slaughter  from "../models/slaughterModel.js";
import Inventory from "../models/inventoryModel.js";


// Create slaughter record
export const createSlaughter = async (req, res) => {
  try {
    const { count } = req.body;
    const branchId = req.user.branchId;

    const allocation = await Allocation.findOne({ branchId }).sort({ createdAt: -1 });

    if (!allocation || allocation.status !== "Received") {
      return res.status(400).send({
        success: false,
        message: "no received allocation found for this branch",
      });
    }

    const totalslaughter = await Slaughter.aggregate([
      { $match: { branchId: allocation.branchId } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);

    const slaughtered = totalslaughter[0]?.total || 0;
    const available = allocation.receivedAnimals - slaughtered;

    if (count > available) {
      return res.status(400).send({
        success: false,
        message: `only ${available} animals are available for slaughter`,
      });
    }

    await Slaughter.create({
      branchId: allocation.branchId,
      date: new Date(),
      count,
    });

    let inventory = await Inventory.findOne({ branchId: allocation.branchId });

    if (!inventory) {
      inventory = await Inventory.create({
        branchId: allocation.branchId,
        totalSlaughtered: count,
        meatStock: 0,
        skinStock: 0,
        payeStock: 0,
      });
    } else {
      inventory.totalSlaughtered += count;
      await inventory.save();
    }

    return res.status(201).send({
      success: true,
      message: "Slaughter record created successfully",
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating slaughter record",
      error: error.message,
    });
  }
};





// Update slaughter record
export const updateSlaughterRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    const branchId = req.user.branchId;

    const slaughterRecord = await Slaughter.findById(id);

    if (!slaughterRecord) {
      return res.status(404).send({
        success: false,
        message: "Slaughter record not found",
      });
    }

    if (slaughterRecord.branchId.toString() !== branchId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!count || count <= 0) {
      return res.status(400).send({
        success: false,
        message: "Valid count is required",
      });
    }

    const allocations = await Allocation.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          status: "Received",
        },
      },
      {
        $group: {
          _id: null,
          totalReceived: { $sum: "$receivedAnimals" },
        },
      },
    ]);

    const totalReceived = allocations[0]?.totalReceived || 0;

    const totalSlaughter = await Slaughter.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
        },
      },
    ]);

    const currentTotal = totalSlaughter[0]?.total || 0;

    const adjustedTotal = currentTotal - slaughterRecord.count + count;

    if (adjustedTotal > totalReceived) {
      return res.status(400).send({
        success: false,
        message: "Slaughter exceeds available animals",
      });
    }

    let inventory = await Inventory.findOne({ branchId });

    if (inventory) {
      inventory.totalSlaughtered =
        inventory.totalSlaughtered - slaughterRecord.count + count;

      await inventory.save();
    }

    slaughterRecord.count = count;
    await slaughterRecord.save();

    res.status(200).send({
      success: true,
      message: "Slaughter record updated successfully",
      data: slaughterRecord,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating slaughter record",
      error: error.message,
    });
  }
};

//  Get single slaughter record
export const getSingleSlaughter = async (req, res) => {
    try {
        const {id} = req.params
        console.log("Params ID ===>", id);
        
        const branchId = req.user.branchId;
        console.log(branchId);
        
        const slaughter = await Slaughter.findById(id);
        console.log("Slaughter ===> ", slaughter);
        
        if(!slaughter){
            return res.status(404).send({
                success :false,
                message : "slaughter record not found"
            })
        }

        if(slaughter.branchId.toString() !== branchId.toString()){
            return res.status(403).send({
                success :false,
                message: "access deneid! you are not authorized to view this slaughter record"
            })
        }
        res.status(200).send({
            success : true,
            message : "slaughter record fetched successfully",
            data: slaughter
        })

        
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "Error fetching slaghter record",
            error : error.message
        })
        
    }
}

// Get all slaughter records for a branch
export const getAllSlaughters = async (req, res) => {
    try {
        const branchId = req.user.branchId;
        console.log("branchId ===> ", branchId);

        const slaughters = await Slaughter.find({ branchId }).sort({ createdAt: -1 });
        console.log(slaughters);
        if(slaughters.length === 0){
            return res.status(404).send({
                success : false,
                message : "no slaughter records found for this branch"
            })
        }
        
        res.status(200).send({
            success : true,
            message : "slaughter records fetched sucessfully",
            data: slaughters
        })
        
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "errorfetching slaughter data",
            error : error.message
        })
        
    }
}



// Delete slaughter record
export const deleteSlaughterRecord = async (req, res) => {
    try {
        const {id} = req.params;
        const branchId = req.user.branchId; 
        const slaughterRecord = await Slaughter.findById(id);

        if(!slaughterRecord){
            return res.status(404).send({
                success : false,
                message : "slaughter record not found"
            })
        }

        if(slaughterRecord.branchId.toString() !== branchId.toString()){
            return res.status(403).send({
                success : false,
                message : "access denied! you are not authorized to delete this slaughter record"
            })
        }


        await slaughterRecord.remove();

        res.status(200).send({
            success : true,
            message : "slaughter record deleted successfully"
        })

    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "error deleting slaughter record",
            error : error.message
        })
    }
}