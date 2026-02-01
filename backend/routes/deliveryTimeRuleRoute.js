import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";
import {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
  getDeliveryTimeEstimate,
  setOrderDeliveryTime,
} from "../controllers/deliveryTimeRuleController.js";

const deliveryTimeRuleRouter = express.Router();

// Public endpoint to get delivery time estimate
deliveryTimeRuleRouter.post("/estimate", getDeliveryTimeEstimate);

// Admin-only endpoints
deliveryTimeRuleRouter.post("/order/set-delivery-time", authMiddleware, adminMiddleware, setOrderDeliveryTime);
deliveryTimeRuleRouter.get("/", authMiddleware, adminMiddleware, getRules);
deliveryTimeRuleRouter.get("/:id", authMiddleware, adminMiddleware, getRule);
deliveryTimeRuleRouter.post("/", authMiddleware, adminMiddleware, createRule);
deliveryTimeRuleRouter.put("/:id", authMiddleware, adminMiddleware, updateRule);
deliveryTimeRuleRouter.delete("/:id", authMiddleware, adminMiddleware, deleteRule);

export default deliveryTimeRuleRouter;
