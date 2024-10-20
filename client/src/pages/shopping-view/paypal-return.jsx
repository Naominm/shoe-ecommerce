import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifySTKPayment } from "@/store/shop/order-slice"; // Adjust the path as necessary

const PaypalReturn = ({ transactionId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      const result = await dispatch(verifySTKPayment(transactionId));
      // Handle the result here (e.g., show success/failure message)
      if (result.payload.success) {
        console.log("Payment verified successfully:", result.payload);
      } else {
        console.error("Payment verification failed:", result.payload);
      }
    };

    if (transactionId) {
      verifyPayment();
    }
  }, [transactionId, dispatch]);

  return <div>Payment Verification in progress...</div>;
};

export default PaypalReturn;
