import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    applications: {
      type: Schema.Types.Map,
      ref: "Application",
      required: true,
    },
  },
  { timestamps: true }
);

groupSchema.index({ name: "text" })

const Groups = model('Group', groupSchema)

export default Groups;