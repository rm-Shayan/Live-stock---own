import mongoose from "mongoose";

const slaughterSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      min: [0, "Count cannot be negative"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Slaughter = mongoose.model("Slaughter", slaughterSchema);

export default Slaughter;
