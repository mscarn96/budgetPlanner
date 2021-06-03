import mongoose from "mongoose";

import Balance from "./balance.interface";

const balanceSchema = new mongoose.Schema<Balance>({
  state: Number,
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const balanceModel = mongoose.model<Balance & mongoose.Document>(
  "balance",
  balanceSchema
);

export default balanceModel;
