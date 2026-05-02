import Inventory from '../models/inventoryModel.js';



export const getInventory = async (req , res ) => {
    try {
        const  branchId = req.user.branchId;
        const inventory = await Inventory.findOne({branchId})

        res.status(200).send({
            success :true,
            message : "inventory Fetched Successfully",
            data : inventory
        })
        
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "Error fetching Inventory",
            error :  error.message
        })
        
    }
}


// Get All Branches Inventory Records
export const getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate("branchId", "name location").sort({createdAt: -1})
        res.status(200).send({
            success : true,
            message : "Inventories fetched successfully",
            data : inventories
        })
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "Error fetching inventories",
            error : error.message
        })
    }
}


// Get inventory by Date Range
export const getInventoryByDateRange = async (req, res) => {
    try {
        const branchId = req.user.branchId;
        const { startDate, endDate } = req.query;
        const inventory = await Inventory.find({
            branchId,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        res.status(200).send({
            success : true,
            message : "Inventory fetched successfully",
            data : inventory
        })
    } catch (error) {
        return res.status(500).send({
            success : false,
            message : "Error fetching inventory",
            error : error.message
        })
    }
}
