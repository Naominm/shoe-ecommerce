import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { verifySTKPayment } from "@/store/shop/order-slice"; // Import the right function to verify payment
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function STKReturnPage() { // Renamed to reflect STK Push
  const dispatch = useDispatch();

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    if (orderId) {
      // Assuming you have an API endpoint to verify STK payment status
      dispatch(verifySTKPayment(orderId)).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success"; // Redirect on successful payment
        } else {
          window.location.href = "/shop/payment-failure"; // Handle payment failure
        }
      });
    }
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing STK Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default STKReturnPage;
