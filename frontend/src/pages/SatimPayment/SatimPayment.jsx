import React, { useEffect, useState } from 'react';
import './SatimPayment.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SatimPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId || !amount) {
      navigate('/');
    }
  }, [orderId, amount, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      if (value.length <= 4) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const validatePaymentData = () => {
    if (!paymentData.cardNumber.replace(/\s/g, '')) {
      toast.error('Please enter card number');
      return false;
    }
    if (!paymentData.cardHolder.trim()) {
      toast.error('Please enter cardholder name');
      return false;
    }
    if (!paymentData.expiryDate) {
      toast.error('Please enter expiry date');
      return false;
    }
    if (!paymentData.cvv) {
      toast.error('Please enter CVV');
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentData()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // For testing: complete payment successfully
      navigate(`/verify?success=true&orderId=${orderId}`);
    }, 2500);
  };

  const handleCancel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate(`/payment-failed?orderId=${orderId}`);
    }, 1000);
  };

  return (
    <div className="satim-payment-container">
      <div className="satim-payment-wrapper">
        {/* Payment Gateway Header */}
        <div className="satim-header">
          <div className="satim-logo">
            <span className="logo-text">SATIM</span>
            <span className="logo-cib">CIB</span>
          </div>
          <h1>Secure Payment Gateway</h1>
          <p className="secure-badge">🔒 Secured Connection</p>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span className="label">Order ID:</span>
            <span className="value">{orderId}</span>
          </div>
          <div className="summary-item">
            <span className="label">Amount to Pay:</span>
            <span className="value amount">DA {parseFloat(amount).toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Currency:</span>
            <span className="value">Algerian Dinar (DZD)</span>
          </div>
        </div>

        {/* Payment Form */}
        <form className="satim-payment-form" onSubmit={handlePaymentSubmit}>
          <h2>Card Details</h2>

          {/* Card Number */}
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <div className="card-input-wrapper">
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                disabled={isProcessing}
                maxLength="19"
                required
              />
              <span className="card-icon">💳</span>
            </div>
            <small className="test-hint">Test: 4111 1111 1111 1111</small>
          </div>

          {/* Cardholder Name */}
          <div className="form-group">
            <label htmlFor="cardHolder">Cardholder Name</label>
            <input
              id="cardHolder"
              type="text"
              name="cardHolder"
              placeholder="Full Name"
              value={paymentData.cardHolder}
              onChange={handleInputChange}
              disabled={isProcessing}
              required
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                id="expiryDate"
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handleInputChange}
                disabled={isProcessing}
                required
              />
              <small className="test-hint">Test: 12/25</small>
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                type="password"
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleInputChange}
                disabled={isProcessing}
                maxLength="4"
                required
              />
              <small className="test-hint">Test: 123</small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-pay"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay DA {parseFloat(amount).toFixed(2)}
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Cancel Payment
            </button>
          </div>
        </form>

        {/* Test Credentials Notice */}
        <div className="test-credentials">
          <h3>🧪 Test Mode - Use These Credentials</h3>
          <div className="credentials-list">
            <div className="credential-item">
              <strong>Card Number:</strong>
              <code>4111 1111 1111 1111</code>
            </div>
            <div className="credential-item">
              <strong>Expiry Date:</strong>
              <code>Any future date (MM/YY)</code>
            </div>
            <div className="credential-item">
              <strong>CVV:</strong>
              <code>Any 3-4 digits</code>
            </div>
            <div className="credential-item">
              <strong>Cardholder Name:</strong>
              <code>Any name</code>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <p>
            🔐 <strong>SATIM CIB</strong> - Your payment information is encrypted and secure.
            This is a test payment interface for development purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SatimPayment;
