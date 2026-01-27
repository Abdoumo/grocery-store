import React, { useContext, useEffect } from 'react'
import './PaymentFailed.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify";

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Payment failed. Your order has been canceled.");
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='payment-failed'>
            <div className="failed-container">
                <div className="failed-icon">❌</div>
                <h1>Payment Failed</h1>
                <p>Your payment could not be processed.</p>
                {orderId && <p className="order-id">Order ID: {orderId}</p>}
                <p className="redirect-message">Redirecting to home page...</p>
                <button onClick={() => navigate("/")} className="home-button">
                    Go to Home
                </button>
            </div>
        </div>
    )
}

export default PaymentFailed
