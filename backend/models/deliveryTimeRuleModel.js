import mongoose from "mongoose";

const deliveryTimeRuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Morning Order"
  startTime: { type: String, required: true }, // HH:mm format
  endTime: { type: String, required: true }, // HH:mm format
  deliveryDate: { type: String, enum: ["today", "tomorrow", "custom"], required: true }, // today, tomorrow, or custom date
  deliveryTime: { type: String, required: true }, // HH:mm format - when to deliver
  customDeliveryDate: { type: Date, default: null }, // For custom date selection
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }, // Higher priority rules are checked first
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const deliveryTimeRuleModel =
  mongoose.models.deliveryTimeRule || mongoose.model("deliveryTimeRule", deliveryTimeRuleSchema);

export default deliveryTimeRuleModel;
