import axios from 'axios';

const chargilyAPI = axios.create({
  baseURL: process.env.CHARGILY_API_URL || 'https://api.chargily.io/test',
  headers: {
    'Authorization': `Bearer ${process.env.CHARGILY_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Create a Chargily payment checkout
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.orderId - Order ID
 * @param {number} paymentData.amount - Payment amount in DZD
 * @param {string} paymentData.customerEmail - Customer email
 * @param {string} paymentData.customerPhone - Customer phone
 * @param {string} paymentData.description - Payment description
 * @returns {Promise<Object>} Chargily checkout response
 */
const createCheckout = async (paymentData) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {

    const checkoutPayload = {
      amount: Math.round(paymentData.amount * 100), // Chargily expects amount in cents
      currency: 'dzd',
      description: paymentData.description || `Order ${paymentData.orderId}`,
      customer_email: paymentData.customerEmail,
      customer_phone: paymentData.customerPhone,
      metadata: {
        orderId: paymentData.orderId,
      },
      success_url: `${frontendUrl}/verify?orderId=${paymentData.orderId}`,
      failure_url: `${frontendUrl}/payment-failed?orderId=${paymentData.orderId}`,
    };

    console.log('[Chargily] Creating checkout with payload:', JSON.stringify(checkoutPayload, null, 2));

    const response = await chargilyAPI.post('/checkouts', checkoutPayload);

    console.log(`[Chargily] Checkout created successfully for order ${paymentData.orderId}:`, {
      id: response.data.id,
      status: response.data.status,
      checkout_url: response.data.checkout_url,
    });

    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error('[Chargily] Checkout creation error:', errorDetails);
    console.warn('[Chargily] Falling back to Chargily test gateway in development mode');

    // In development, when API is unreachable, redirect to Chargily test gateway
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Chargily] Using SATIM CIB payment template for development');
      const mockCheckoutId = `chk_test_${Date.now()}`;
      return {
        id: mockCheckoutId,
        status: 'pending',
        // Use SATIM CIB payment template when Chargily API is unavailable
        checkout_url: `${frontendUrl}/satim-payment?orderId=${paymentData.orderId}&amount=${paymentData.amount}`,
      };
    }

    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(`Failed to create Chargily checkout: ${errorMessage}`);
  }
};

/**
 * Verify a Chargily payment
 * @param {string} checkoutId - Chargily checkout ID
 * @returns {Promise<Object>} Chargily checkout status
 */
const verifyCheckout = async (checkoutId) => {
  try {
    const response = await chargilyAPI.get(`/checkouts/${checkoutId}`);
    console.log(`[Chargily] Checkout verified for ID ${checkoutId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('[Chargily] Verification error:', error.response?.data || error.message);
    throw new Error(`Failed to verify Chargily checkout: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Verify webhook signature from Chargily
 * @param {Object} payload - Webhook payload
 * @param {string} signature - Signature from Chargily header
 * @returns {boolean} Whether signature is valid
 */
const verifyWebhookSignature = (payload, signature) => {
  // Chargily uses HMAC-SHA256 for webhook signing
  // For test mode, you might need to adjust the verification logic
  // This is a placeholder - check Chargily documentation for exact implementation
  console.log('[Chargily] Webhook signature verification (placeholder)');
  return true; // In production, verify using crypto.subtle.sign or similar
};

export { chargilyAPI, createCheckout, verifyCheckout, verifyWebhookSignature };
