import mongoose from "mongoose";

const receiveSchema = new mongoose.Schema({
    allocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allocation",
        required: true
    },
    receivedAnimals: {
        type: Number,
        required: true
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
})

const Receive = mongoose.model("Receive", receiveSchema)

export default Receive;