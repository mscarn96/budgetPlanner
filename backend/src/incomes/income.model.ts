import mongoose from "mongoose";

import Income from "./income.interface";

const incomeSchema = new mongoose.Schema<Income>({
  name: String,
  value: Number,
  cyclic: Boolean,
  dayPeriod: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const incomeModel = mongoose.model<Income & mongoose.Document>(
  "Income",
  incomeSchema
);

export default incomeModel;
