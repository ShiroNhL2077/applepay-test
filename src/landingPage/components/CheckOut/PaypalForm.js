
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "react-toastify";

const PaypalForm = ({ order, userLogged }) => {
  const createOrder = async (data, actions) => {
    // Assume your API returns the order details including currency and totalAmount
    const orderData = {
      eventId: order.eventId,
      items: order.items,
      participantDetails: order.participantDetails,
      validityStartDate: order.validityStartDate,
      validityEndDate: order.validityEndDate,
      validityStartTime: order.validityStartTime,
      validityEndTime: order.validityEndTime,
    };
    const token = localStorage.getItem("token");
    console.log(orderData);
    try {
      const response = await axios.post(
        token && userLogged
          ? `${process.env.REACT_APP_API_URL}orders/paypal/create`
          : `${process.env.REACT_APP_API_URL}orders/paypal/create`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderDetails = response.data;

      console.log(orderDetails);

      return actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Event Tickets Purchase",
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw new Error("Error creating PayPal order");
    }
  };

  const onApprove = async (data, actions) => {
    try {
      // Capture the PayPal payment
      const captureDetails = await actions.order.capture();

      // Check if the capture was successful
      if (captureDetails.status === "COMPLETED") {
        // Additional logic to update UI or show success message
        toast.success("Payment successful! Tickets purchased.");
      } else {
        // Handle payment capture failure
        toast.error("Error processing payment. Please try again.");
      }
    } catch (error) {
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
        style={{ layout: "horizontal", color: "blue", tagline: false }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalForm;
