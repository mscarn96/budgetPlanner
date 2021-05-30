import mongoose from "mongoose";

import Expenditure from "./expenditure.interface";

const expenditureSchema = new mongoose.Schema<Expenditure>({
  name: String,
  cyclic: Boolean,
  dayPeriod: Number,
  value: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const expenditureModel = mongoose.model<Expenditure & mongoose.Document>(
  "Expenditure",
  expenditureSchema
);

export default expenditureModel;
