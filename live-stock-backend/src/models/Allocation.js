import mongoose from "mongoose";

const AllocationSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    receivedAnimals: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Received"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Allocation = mongoose.model("Allocation", AllocationSchema);

export default Allocation;
