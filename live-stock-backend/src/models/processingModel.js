import mongoose from "mongoose";
const processingSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Branch",
        required : true,
    },
    slaughterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slaughter",
        required : true
    },
    meatWeight: {
        type: Number,
        required : true,

    },
    skins: {
        type : Number,
        required :  true
    },
    paye : {
        type: Number,
        required : true,
    }
},
{
    timestamps: true,
})

export const Processing = mongoose.model("Processing", processingSchema);