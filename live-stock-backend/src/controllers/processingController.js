import { Processing } from "../models/processingModel.js";
import Inventory  from "../models/inventoryModel.js";
import Branch from "../models/Branch.js";
import Slaughter from "../models/slaughterModel.js";

export const createProcessing = async (req, res) => {
    try {
        const branchId = req.user.branchId;
        
        console.log("BranchId ===>", branchId);
        
        const {slaughterId} = req.params;
        const { meatWeight, skins , paye} = req.body;

        if(!slaughterId){
            return res.status(400).send({
                success : false,
                message : "slaughterId is required"
            })
        }

        if(!meatWeight || !skins || !paye){
            return res.status(400).send({
                success : false,
                message : "meat weight, skins and paye are required"
            })
        }

        if(meatWeight <= 0 || skins < 0 || paye < 0){
            return res.status(400).send({
                success : false,
                message : "meat weight must be greater than 0 and skins and paye cannot be negative"
            })
        }
           console.log("slaughterId===>", slaughterId);
        

        const checkSlaughter = await Slaughter.findById(slaughterId);
        console.log("checkSlaughter ===>", checkSlaughter);
        if(!checkSlaughter){
            return res.status(404).send({
                success : false,
                message : "slaughter record not found"
            })
        }

        const exitistingAnimals = checkSlaughter.count;
          console.log("Total Animal", exitistingAnimals);

        const matchSkins = skins == exitistingAnimals;
        console.log("Match Skins ===>", matchSkins);
        
        if(!matchSkins){
            return res.status(400).send({
                success : false,
                message : `number of skins must match the number of animals slaughtered which is ${exitistingAnimals}`
            })
        }
          
        const matchPaye = paye / 4 == exitistingAnimals;    
        console.log("Match Paye ===>", matchPaye);
        if(!matchPaye){
            return res.status(400).send({
                success : false,
                message : `paye must be equal to one fourth of the number of animals slaughtered which is ${exitistingAnimals / 4}`
            })
        }

        const processing = await Processing.create({
            branchId: branchId,
            slaughterId,
            meatWeight,
            skins,
            paye
        });

        console.log("Processing ===>", processing);


        let inventory = await Inventory.findOne({branchId});
        if(!inventory){
            inventory = await Inventory.create({
                branchId,
                meatStock: meatWeight, 
                skinStock: skins,
                payeStock: paye
            });
        } else {
            inventory.meatStock += meatWeight;
            inventory.skinStock += skins;
            inventory.payeStock += paye;
        }
        await inventory.save();


        res.status(201).send({
            success : true,
            message : "processing record created successfully"
        })
        
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "Error creating processing record",
            error:  error.message
        })
        
    }
}

// Get single processing record
export const getSingleProcess = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("Params ID ===>", id);
        const branchId = req.user.branchId;
        console.log("BranchId ===>", branchId);
        const processingRecord = await Processing.findById(id)
        .populate("slaughterId")
        console.log("Processing Record ===>", processingRecord);
        

        if(!processingRecord){
            return res.status(404).send({
                success: false,
                message : "processing record not found",

            })

        }
        if(processingRecord.branchId.toString() !== branchId.toString()){
            return res.status(403).send({
                success : false,
                message :" access denied! you are not authorized to view this processing record"
            })

        }

         res.status(200).send({
            success: true,
            message : "process record fetched succesfully",
            data : processingRecord
         })
        
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "error fetching processing reord",
            error : error.message
        })
        
    }
}


// Get all processing records for a branch
export const getAllprocessRecords = async (req, res) => {
    try {
        const branchId = req.user.branchId;
        const processingRecords = await Processing.find({branchId}).populate("slaughterId").sort({createdAt: -1})
        
        if(processingRecords.length === 0){
            return res.status(200).send({
                success : true,
                message : "no processing records found for this branch",
                data : []
             })
        }

        res.status(200).send({
            success : true,
            message : "processing records fetched successfullly",
            data : processingRecords
        })
    } catch (error) {
        return res.status(500).send({
            success : false,
            message :"Error fetching processing reccords",
            error: error.message
        })
        
    }
}


// Update processing record
export const updateProcessingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { meatWeight, skins, paye } = req.body;
    const branchId = req.user.branchId;

    const record = await Processing.findById(id);

    if (!record) {
      return res.status(404).send({ success: false, message: "Processing not found" });
    }

    if (record.branchId.toString() !== branchId.toString()) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    const slaughter = await Slaughter.findById(record.slaughterId);

    if (!slaughter) {
      return res.status(404).send({
        success: false,
        message: "Slaughter record not found",
      });
    }

    const animals = slaughter.count;

    if (skins !== animals) {
      return res.status(400).send({
        success: false,
        message: `skins must be ${animals}`,
      });
    }

    if (paye !== animals * 4) {
      return res.status(400).send({
        success: false,
        message: `paye must be ${animals * 4}`,
      });
    }

    if (meatWeight <= 0 || skins <= 0 || paye <= 0){
            return res.status(400).send({
                success : false,
                message : "meat weight, skins and paye must be greater than 0"
             })
        }
        

    const oldMeat = record.meatWeight;
    const oldSkin = record.skins;
    const oldPaye = record.paye;


    record.meatWeight = meatWeight;
    record.skins = skins;
    record.paye = paye;

    await record.save();


    let inventory = await Inventory.findOne({ branchId });

    if (inventory) {
      inventory.meatStock = inventory.meatStock - oldMeat + meatWeight;
      inventory.skinStock = inventory.skinStock - oldSkin + skins;
      inventory.payeStock = inventory.payeStock - oldPaye + paye;

      await inventory.save();
    }

    res.status(200).send({
      success: true,
      message: "Processing updated successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating processing",
      error: error.message,
    });
  }
};

// Delete processing record
export const deleteProcessingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.user.branchId;

    const record = await Processing.findById(id);

    if (!record) {
      return res.status(404).send({ success: false, message: "Processing not found" });
    }

    if (record.branchId.toString() !== branchId.toString()) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    let inventory = await Inventory.findOne({ branchId });

    if (inventory) {
      inventory.meatStock -= record.meatWeight;
      inventory.skinStock -= record.skins;
      inventory.payeStock -= record.paye;

      await inventory.save();
    }

    await record.deleteOne();

    res.status(200).send({
      success: true,
      message: "Processing deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting processing",
      error: error.message,
    });
  }
};


// Date range filter for processing records
export const filterProcessingByDate = async (req, res) => {
    try {
        const branchId = req.user.branchId;
        const { startDate, endDate } = req.query;
        const records = await Processing.find({
            branchId,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate("slaughterId").sort({createdAt: -1});
        res.status(200).send({
            success : true,
            message : "Processing records fetched successfully",
            data : records
        });
    } catch (error) {
        return res.status(500).send({
            success : false,    
            message : "Error fetching processing records",
            error : error.message
        })
    }
}