import React, { useEffect, useState } from 'react';
import './PaymentTest.css';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId || !amount) {
      navigate('/');
    }
  }, [orderId, amount, navigate]);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate payment processing
      navigate(`/verify?success=true&orderId=${orderId}`);
    }, 2000);
  };

  const handlePaymentFailed = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate payment failure
      navigate(`/verify?success=false&orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="payment-test-container">
      <div className="payment-test-card">
        <div className="payment-header">
          <h1>Test Payment Gateway</h1>
          <p className="test-badge">DEVELOPMENT MODE</p>
        </div>

        <div className="payment-info">
          <div className="info-item">
            <span className="label">Order ID:</span>
            <span className="value">{orderId}</span>
          </div>
          <div className="info-item">
            <span className="label">Amount:</span>
            <span className="value highlight">DA {amount}</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value pending">Pending Payment</span>
          </div>
        </div>

        <div className="payment-test-notice">
          <h3>Test Payment Instructions</h3>
          <ul>
            <li>This is a test payment gateway for development only</li>
            <li>No actual payment will be processed</li>
            <li>Click "Complete Payment" to simulate a successful payment</li>
            <li>Click "Decline Payment" to test the failure flow</li>
          </ul>
        </div>

        <div className="payment-actions">
          <button 
            className="btn btn-success"
            onClick={handlePaymentSuccess}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : '✓ Complete Payment'}
          </button>
          <button 
            className="btn btn-danger"
            onClick={handlePaymentFailed}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : '✗ Decline Payment'}
          </button>
        </div>

        <div className="payment-footer">
          <p>
            This test payment page simulates Chargily or any payment gateway. 
            In production, replace this with your actual payment provider's integration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
