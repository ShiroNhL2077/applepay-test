import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalForm = ({
  eventId,
  items,
  participantDetails,
  validityStartDate,
  validityEndDate,
  validityStartTime,
  validityEndTime,
  userLogged,
}) => {
  const [orderStatus, setOrderStatus] = useState(null);

  const createOrder = async (data, actions) => {
    // Assume your API returns the order details including currency and totalAmount
    const orderData = {
      eventId,
      items,
      participantDetails,
      validityStartDate,
      validityEndDate,
      validityStartTime,
      validityEndTime,
    };
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        token && userLogged
          ? `${process.env.REACT_APP_API_URL}orders/paypal/create`
          : `${process.env.REACT_APP_API_URL}orders/paypal/guest/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      const orderDetails = await response.json();
      return actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Event Tickets Purchase",
            amount: {
              currency_code: orderDetails.currency,
              value: orderDetails.totalAmount.toFixed(2),
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setOrderStatus("error");
      throw new Error("Error creating PayPal order");
    }
  };

  const onApprove = async (data, actions) => {
    try {
      // Capture the PayPal payment
      const captureDetails = await actions.order.capture();

      // Check if the capture was successful
      if (captureDetails.status === "COMPLETED") {
        setOrderStatus("success");
        // Additional logic to update UI or show success message
      } else {
        setOrderStatus("error");
        // Handle payment capture failure
      }
    } catch (error) {
      setOrderStatus("error");
      console.error("Error processing payment:", error);
    }
  };

  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={() => setOrderStatus("error")}
        style={{ layout: "horizontal", color: "blue" }} // Set layout to 'horizontal' or 'vertical'
      />
      {orderStatus === "success" && (
        <p>Payment successful! Tickets purchased.</p>
      )}
      {orderStatus === "error" && (
        <p>Error processing payment. Please try again.</p>
      )}
    </PayPalScriptProvider>
  );
};

export default PaypalForm;
