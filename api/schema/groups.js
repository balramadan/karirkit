import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    applications: {
      type: Schema.Types.Map,
      ref: "Application",
      required: true,
    },
  },
  { timestamps: true }
);

groupSchema.index({ name: "text" });
groupSchema.index({ user: 1 });

const Groups = model("Group", groupSchema);

export default Groups;