import React, { useContext, useEffect, useState } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkoutId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);

    const verifyPayment = async () => {
        try {
            if (!orderId) {
                toast.error("Order ID not found");
                navigate("/");
                return;
            }

            // Prepare verification data
            const verifyData = {
                orderId,
                ...(checkoutId && { checkoutId }), // Include checkoutId if available (for Chargily)
                ...(success && { success }) // Include success for test mode
            };

            console.log("Verifying payment with data:", verifyData);

            const response = await axios.post(url + "/api/order/verify", verifyData);

            if (response.data.success) {
                toast.success("Order Placed Successfully!");
                setTimeout(() => {
                    navigate("/myorders");
                }, 1500);
            } else {
                toast.error(response.data.message || "Payment verification failed");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error verifying payment");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } finally {
            setVerifying(false);
        }
    };

    useEffect(() => {
        // Add a small delay to ensure webhook processing is complete
        const timer = setTimeout(() => {
            verifyPayment();
        }, 1000);

        return () => clearTimeout(timer);
    }, [])

    return (
        <div className='verify'>
            {verifying ? (
                <>
                    <div className="spinner"></div>
                    <p>Verifying your payment...</p>
                </>
            ) : (
                <p>Redirecting...</p>
            )}
        </div>
    )
}

export default Verify
