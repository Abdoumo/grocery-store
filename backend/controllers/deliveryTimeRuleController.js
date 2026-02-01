import deliveryTimeRuleModel from "../models/deliveryTimeRuleModel.js";

// Convert time string HH:mm to minutes for comparison
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes back to HH:mm format
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Get current time in HH:mm format
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

// Calculate delivery time based on active rules
const calculateDeliveryTime = async (orderTime = null) => {
  try {
    const timeToCheck = orderTime || getCurrentTime();
    const currentMinutes = timeToMinutes(timeToCheck);

    // Fetch all active rules sorted by priority (higher priority first)
    const rules = await deliveryTimeRuleModel
      .find({ isActive: true })
      .sort({ priority: -1 });

    if (rules.length === 0) {
      return { success: false, message: "No delivery rules configured" };
    }

    // Find matching rule
    for (const rule of rules) {
      const startMinutes = timeToMinutes(rule.startTime);
      const endMinutes = timeToMinutes(rule.endTime);

      // Check if order time falls within this rule's time range
      const isMatching = startMinutes <= currentMinutes && currentMinutes <= endMinutes;

      if (isMatching) {
        let deliveryDate = new Date();

        // Calculate delivery date
        if (rule.deliveryDate === "tomorrow") {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        } else if (rule.deliveryDate === "custom" && rule.customDeliveryDate) {
          deliveryDate = new Date(rule.customDeliveryDate);
        }

        // Set delivery time
        const [deliveryHours, deliveryMinutes] = rule.deliveryTime.split(":").map(Number);
        deliveryDate.setHours(deliveryHours, deliveryMinutes, 0, 0);

        return {
          success: true,
          rule: {
            id: rule._id,
            name: rule.name,
            description: rule.description,
          },
          deliveryDate: deliveryDate,
          deliveryTime: rule.deliveryTime,
          deliveryDateType: rule.deliveryDate,
          estimatedDeliveryTime: deliveryDate.getTime(), // milliseconds since epoch
        };
      }
    }

    // If no rule matches, return error
    return { success: false, message: "No matching delivery rule for this order time" };
  } catch (error) {
    console.error("Error calculating delivery time:", error);
    return { success: false, message: "Error calculating delivery time" };
  }
};

// GET all rules
const getRules = async (req, res) => {
  try {
    const rules = await deliveryTimeRuleModel.find().sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, rules });
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.json({ success: false, message: "Error fetching delivery rules" });
  }
};

// GET single rule
const getRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await deliveryTimeRuleModel.findById(id);

    if (!rule) {
      return res.json({ success: false, message: "Rule not found" });
    }

    res.json({ success: true, rule });
  } catch (error) {
    console.error("Error fetching rule:", error);
    res.json({ success: false, message: "Error fetching rule" });
  }
};

// CREATE new rule
const createRule = async (req, res) => {
  try {
    const { name, startTime, endTime, deliveryDate, deliveryTime, priority, description, customDeliveryDate } = req.body;

    // Validate required fields
    if (!name || !startTime || !endTime || !deliveryDate || !deliveryTime) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime) || !timeRegex.test(deliveryTime)) {
      return res.json({ success: false, message: "Invalid time format. Use HH:mm" });
    }

    // Validate delivery date
    if (!["today", "tomorrow", "custom"].includes(deliveryDate)) {
      return res.json({ success: false, message: "Delivery date must be 'today', 'tomorrow', or 'custom'" });
    }

    // Validate custom date if selected
    if (deliveryDate === "custom" && !customDeliveryDate) {
      return res.json({ success: false, message: "Custom delivery date is required when deliveryDate is 'custom'" });
    }

    // Check if rule name already exists
    const existingRule = await deliveryTimeRuleModel.findOne({ name });
    if (existingRule) {
      return res.json({ success: false, message: "Rule with this name already exists" });
    }

    const newRule = new deliveryTimeRuleModel({
      name,
      startTime,
      endTime,
      deliveryDate,
      deliveryTime,
      customDeliveryDate: customDeliveryDate || null,
      priority: priority || 0,
      description: description || "",
    });

    await newRule.save();
    res.json({ success: true, message: "Rule created successfully", rule: newRule });
  } catch (error) {
    console.error("Error creating rule:", error);
    res.json({ success: false, message: "Error creating rule" });
  }
};

// UPDATE rule
const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startTime, endTime, deliveryDate, deliveryTime, priority, description, isActive, customDeliveryDate } = req.body;

    const rule = await deliveryTimeRuleModel.findById(id);
    if (!rule) {
      return res.json({ success: false, message: "Rule not found" });
    }

    // Validate time format if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (startTime && !timeRegex.test(startTime)) {
      return res.json({ success: false, message: "Invalid start time format. Use HH:mm" });
    }
    if (endTime && !timeRegex.test(endTime)) {
      return res.json({ success: false, message: "Invalid end time format. Use HH:mm" });
    }
    if (deliveryTime && !timeRegex.test(deliveryTime)) {
      return res.json({ success: false, message: "Invalid delivery time format. Use HH:mm" });
    }

    // Check if new name exists (and is different from current)
    if (name && name !== rule.name) {
      const existingRule = await deliveryTimeRuleModel.findOne({ name });
      if (existingRule) {
        return res.json({ success: false, message: "Rule with this name already exists" });
      }
    }

    // Update fields
    if (name !== undefined) rule.name = name;
    if (startTime !== undefined) rule.startTime = startTime;
    if (endTime !== undefined) rule.endTime = endTime;
    if (deliveryDate !== undefined) {
      if (!["today", "tomorrow", "custom"].includes(deliveryDate)) {
        return res.json({ success: false, message: "Delivery date must be 'today', 'tomorrow', or 'custom'" });
      }
      rule.deliveryDate = deliveryDate;
    }
    if (customDeliveryDate !== undefined) rule.customDeliveryDate = customDeliveryDate || null;
    if (deliveryTime !== undefined) rule.deliveryTime = deliveryTime;
    if (priority !== undefined) rule.priority = priority;
    if (description !== undefined) rule.description = description;
    if (isActive !== undefined) rule.isActive = isActive;

    rule.updatedAt = new Date();
    await rule.save();

    res.json({ success: true, message: "Rule updated successfully", rule });
  } catch (error) {
    console.error("Error updating rule:", error);
    res.json({ success: false, message: "Error updating rule" });
  }
};

// DELETE rule
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    const rule = await deliveryTimeRuleModel.findByIdAndDelete(id);
    if (!rule) {
      return res.json({ success: false, message: "Rule not found" });
    }

    res.json({ success: true, message: "Rule deleted successfully" });
  } catch (error) {
    console.error("Error deleting rule:", error);
    res.json({ success: false, message: "Error deleting rule" });
  }
};

// Calculate delivery time for a given order time
const getDeliveryTimeEstimate = async (req, res) => {
  try {
    const { orderTime } = req.body;

    const result = await calculateDeliveryTime(orderTime);
    res.json(result);
  } catch (error) {
    console.error("Error calculating delivery time:", error);
    res.json({ success: false, message: "Error calculating delivery time" });
  }
};

// Manually set delivery time for a specific order (Admin only)
const setOrderDeliveryTime = async (req, res) => {
  try {
    const { orderId, deliveryDate, deliveryTime } = req.body;

    if (!orderId || !deliveryDate || !deliveryTime) {
      return res.json({ success: false, message: "Missing required fields: orderId, deliveryDate, deliveryTime" });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(deliveryTime)) {
      return res.json({ success: false, message: "Invalid delivery time format. Use HH:mm" });
    }

    // Import orderModel here to avoid circular dependency
    const orderModel = (await import("../models/orderModel.js")).default;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Parse the delivery date and time
    const deliveryDateTime = new Date(deliveryDate);
    const [hours, minutes] = deliveryTime.split(":").map(Number);
    deliveryDateTime.setHours(hours, minutes, 0, 0);

    // Update order with new delivery time
    order.estimatedDeliveryTime = deliveryDateTime.getTime();
    await order.save();

    res.json({
      success: true,
      message: "Delivery time updated successfully",
      order: {
        _id: order._id,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        deliveryDate: deliveryDateTime,
      },
    });
  } catch (error) {
    console.error("Error setting delivery time:", error);
    res.json({ success: false, message: "Error setting delivery time" });
  }
};

export {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
  getDeliveryTimeEstimate,
  calculateDeliveryTime,
  setOrderDeliveryTime,
};
