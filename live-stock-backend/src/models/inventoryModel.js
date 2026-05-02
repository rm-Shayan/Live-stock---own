import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        unique: true
    },

    // Animals tracking
    totalAnimalsReceived: {
        type: Number,
        default: 0
    },
    totalSlaughtered: {
        type: Number,
        default: 0
    },

    // Stock tracking
    meatStock: {
        type: Number,
        default: 0
    },
    skinStock: {
        type: Number,
        default: 0
    },
    payeStock: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;