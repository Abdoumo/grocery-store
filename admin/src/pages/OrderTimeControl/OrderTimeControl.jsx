import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./OrderTimeControl.css";

const OrderTimeControl = ({ url }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [testTime, setTestTime] = useState("");
  const [testResult, setTestResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    deliveryDate: "today",
    deliveryTime: "",
    customDeliveryDate: "",
    priority: 0,
    description: "",
    isActive: true,
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDeliveryForm, setOrderDeliveryForm] = useState({
    deliveryDate: "",
    deliveryTime: "",
  });

  // Fetch all rules
  const fetchRules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/delivery-time-rules`, {
        headers: { token },
      });

      if (response.data.success) {
        setRules(response.data.rules);
      } else {
        toast.error(response.data.message || "Failed to fetch rules");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching rules");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Load rules and orders on component mount
  useEffect(() => {
    fetchRules();
    fetchOrders();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.startTime || !formData.endTime || !formData.deliveryTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate times
    if (formData.startTime >= formData.endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    // Validate custom date if needed
    if (formData.deliveryDate === "custom" && !formData.customDeliveryDate) {
      toast.error("Please select a custom delivery date");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editingId) {
        // Update existing rule
        response = await axios.put(
          `${url}/api/delivery-time-rules/${editingId}`,
          formData,
          { headers: { token } }
        );
      } else {
        // Create new rule
        response = await axios.post(`${url}/api/delivery-time-rules`, formData, {
          headers: { token },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: "",
          startTime: "",
          endTime: "",
          deliveryDate: "today",
          deliveryTime: "",
          priority: 0,
          description: "",
          isActive: true,
        });
        setEditingId(null);
        setShowForm(false);
        fetchRules();
      } else {
        toast.error(response.data.message || "Failed to save rule");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving rule");
    }
  };

  // Handle edit
  const handleEdit = (rule) => {
    setFormData({
      name: rule.name,
      startTime: rule.startTime,
      endTime: rule.endTime,
      deliveryDate: rule.deliveryDate,
      deliveryTime: rule.deliveryTime,
      priority: rule.priority,
      description: rule.description,
      isActive: rule.isActive,
    });
    setEditingId(rule._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${url}/api/delivery-time-rules/${id}`, {
          headers: { token },
        });

        if (response.data.success) {
          toast.success("Rule deleted successfully");
          fetchRules();
        } else {
          toast.error(response.data.message || "Failed to delete rule");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting rule");
      }
    }
  };

  // Test delivery time calculation
  const handleTestDelivery = async () => {
    if (!testTime) {
      toast.error("Please enter a time to test");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/delivery-time-rules/estimate`, {
        orderTime: testTime,
      });

      if (response.data.success) {
        const deliveryDate = new Date(response.data.deliveryDate);
        setTestResult({
          success: true,
          rule: response.data.rule.name,
          time: response.data.deliveryTime,
          date: response.data.deliveryDateType,
          fullDate: deliveryDate.toLocaleString(),
        });
      } else {
        setTestResult({
          success: false,
          message: response.data.message || "No matching rule found",
        });
      }
    } catch (error) {
      toast.error("Error testing delivery time");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      startTime: "",
      endTime: "",
      deliveryDate: "today",
      deliveryTime: "",
      customDeliveryDate: "",
      priority: 0,
      description: "",
      isActive: true,
    });
  };

  // Set delivery time for a specific order
  const handleSetOrderDeliveryTime = async () => {
    if (!selectedOrder || !orderDeliveryForm.deliveryDate || !orderDeliveryForm.deliveryTime) {
      toast.error("Please select order, date, and time");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/delivery-time-rules/order/set-delivery-time`,
        {
          orderId: selectedOrder._id,
          deliveryDate: orderDeliveryForm.deliveryDate,
          deliveryTime: orderDeliveryForm.deliveryTime,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Delivery time updated for order");
        setSelectedOrder(null);
        setOrderDeliveryForm({ deliveryDate: "", deliveryTime: "" });
        fetchOrders();
      } else {
        toast.error(response.data.message || "Failed to update delivery time");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating delivery time");
    }
  };

  return (
    <div className="order-time-control">
      <div className="otc-header">
        <h1>Delivery Time Rules Management</h1>
        <button
          className="otc-btn-add"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Rule"}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="otc-form-container">
          <h2>{editingId ? "Edit Rule" : "Create New Rule"}</h2>
          <form onSubmit={handleSubmit} className="otc-form">
            <div className="otc-form-row">
              <div className="otc-form-group">
                <label>Rule Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Morning Orders"
                  required
                />
              </div>

              <div className="otc-form-group">
                <label>Priority</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
                <small>Higher priority rules are checked first</small>
              </div>
            </div>

            <div className="otc-form-row">
              <div className="otc-form-group">
                <label>Order Time From *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="otc-form-group">
                <label>Order Time To *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="otc-form-row">
              <div className="otc-form-group">
                <label>Delivery Date *</label>
                <select
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                >
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>

              {formData.deliveryDate === "custom" && (
                <div className="otc-form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    name="customDeliveryDate"
                    value={formData.customDeliveryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="otc-form-group">
                <label>Delivery Time *</label>
                <input
                  type="time"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="otc-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description for this rule"
                rows="3"
              />
            </div>

            <div className="otc-form-group">
              <label className="otc-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>

            <div className="otc-form-actions">
              <button type="submit" className="otc-btn-submit">
                {editingId ? "Update Rule" : "Create Rule"}
              </button>
              <button
                type="button"
                className="otc-btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Test Section */}
      <div className="otc-test-container">
        <h3>Test Delivery Time Calculation</h3>
        <div className="otc-test-group">
          <input
            type="time"
            value={testTime}
            onChange={(e) => setTestTime(e.target.value)}
            placeholder="Enter order time"
          />
          <button onClick={handleTestDelivery} className="otc-btn-test">
            Test
          </button>
        </div>

        {testResult && (
          <div className={`otc-test-result ${testResult.success ? "success" : "error"}`}>
            {testResult.success ? (
              <>
                <p>
                  <strong>Matching Rule:</strong> {testResult.rule}
                </p>
                <p>
                  <strong>Delivery Time:</strong> {testResult.time}
                </p>
                <p>
                  <strong>Delivery Date:</strong> {testResult.date}
                </p>
                <p className="otc-full-date">{testResult.fullDate}</p>
              </>
            ) : (
              <p className="otc-error-msg">{testResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Order Delivery Time Management */}
      <div className="otc-order-management-container">
        <h2>Set Delivery Time for Orders</h2>
        <div className="otc-order-manager">
          <div className="otc-order-selector">
            <label>Select Order</label>
            <select
              value={selectedOrder ? selectedOrder._id : ""}
              onChange={(e) => {
                const order = orders.find((o) => o._id === e.target.value);
                setSelectedOrder(order);
              }}
            >
              <option value="">-- Choose an order --</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order._id.slice(-6)} - {order.items?.length || 0} items - Da{order.amount} - Status: {order.status}
                </option>
              ))}
            </select>
          </div>

          {selectedOrder && (
            <div className="otc-order-details">
              <div className="otc-order-info">
                <p>
                  <strong>Customer:</strong> {selectedOrder.address?.firstName} {selectedOrder.address?.lastName}
                </p>
                <p>
                  <strong>Items:</strong> {selectedOrder.items?.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                </p>
                <p>
                  <strong>Amount:</strong> Da{selectedOrder.amount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
              </div>

              <div className="otc-delivery-time-form">
                <div className="otc-form-group">
                  <label>Delivery Date *</label>
                  <input
                    type="date"
                    value={orderDeliveryForm.deliveryDate}
                    onChange={(e) =>
                      setOrderDeliveryForm((prev) => ({
                        ...prev,
                        deliveryDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="otc-form-group">
                  <label>Delivery Time *</label>
                  <input
                    type="time"
                    value={orderDeliveryForm.deliveryTime}
                    onChange={(e) =>
                      setOrderDeliveryForm((prev) => ({
                        ...prev,
                        deliveryTime: e.target.value,
                      }))
                    }
                  />
                </div>

                <button
                  type="button"
                  className="otc-btn-submit"
                  onClick={handleSetOrderDeliveryTime}
                >
                  Set Delivery Time
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div className="otc-rules-container">
        <h2>Active Rules ({rules.filter((r) => r.isActive).length})</h2>

        {loading ? (
          <p className="otc-loading">Loading rules...</p>
        ) : rules.length === 0 ? (
          <p className="otc-no-rules">No delivery rules configured yet. Create your first rule!</p>
        ) : (
          <div className="otc-rules-table">
            {rules
              .sort((a, b) => b.priority - a.priority)
              .map((rule) => (
                <div
                  key={rule._id}
                  className={`otc-rule-card ${!rule.isActive ? "inactive" : ""}`}
                >
                  <div className="otc-rule-header">
                    <h3>{rule.name}</h3>
                    <span className={`otc-badge ${rule.isActive ? "active" : "inactive"}`}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="otc-rule-content">
                    <div className="otc-rule-row">
                      <div className="otc-rule-item">
                        <span className="otc-label">Time Range:</span>
                        <span className="otc-value">
                          {rule.startTime} - {rule.endTime}
                        </span>
                      </div>
                      <div className="otc-rule-item">
                        <span className="otc-label">Delivery:</span>
                        <span className="otc-value">
                          {rule.deliveryTime} ({rule.deliveryDate})
                        </span>
                      </div>
                      <div className="otc-rule-item">
                        <span className="otc-label">Priority:</span>
                        <span className="otc-value">{rule.priority}</span>
                      </div>
                    </div>

                    {rule.description && (
                      <p className="otc-description">{rule.description}</p>
                    )}
                  </div>

                  <div className="otc-rule-actions">
                    <button
                      className="otc-btn-edit"
                      onClick={() => handleEdit(rule)}
                    >
                      Edit
                    </button>
                    <button
                      className="otc-btn-delete"
                      onClick={() => handleDelete(rule._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeControl;
