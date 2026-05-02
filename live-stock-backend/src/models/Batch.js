import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    BatchNum: {
      type: String,
      required: true,
      trim: true,
    },
    TotalAnimals: {
      type: Number,
      required: true,
      min: [0, "Animals cannot be negative"],
    },
    remainingAnimals: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["cow", "goat", "bull", "sheep"],
    },
    ArrivalDate: {
      type: Date,
      default: Date.now,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true },
);

const Batch = mongoose.model("Batch", BatchSchema);

export default Batch;
