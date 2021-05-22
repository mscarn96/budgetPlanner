import mongoose from "mongoose";

import Expenditure from "./expenditure.interface";

const expenditureSchema = new mongoose.Schema<Expenditure>({
  name: {
    type: String,
    required: [true, "Please add name of expenditure."],
    minLength: [3, "Name must be longer than 3 characters."],
    maxLength: [16, "Name must be shorter than 16 characters."],
  },
  cyclic: {
    type: Boolean,
    required: true,
  },
  dayPeriod: Number,
  icon: {
    type: String,
    required: [true, "Please add icon path"],
  },
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
