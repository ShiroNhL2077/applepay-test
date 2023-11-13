// Import necessary dependencies
import {
  useStripe,
  useElements,
  PaymentElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
// eslint-disable-next-line
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./PaymentForm.css";

// Create the CheckoutForm component
const ApplePaymentForm = ({ order, userLogged }) => {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  // eslint-disable-next-line
  const [btnDisabled, setBtnDisabled] = useState(false);
  // eslint-disable-next-line
  const [btnClicked, setBtnClicked] = useState(false);

  const createOrderWithStripeClient = async () => {
    const token = localStorage.getItem("token");
    const orderDetails = {
      eventId: order.eventId,
      items: order.items,
      participantDetails: order.participantDetails,
      validityStartDate: order.validityStartDate,
      validityEndDate: order.orderTicketsDate,
      validityStartTime: "11:00:00",
      validityEndTime: "20:00:00",
    };
    if (!token && userLogged) {
      console.log("no token");
      toast.error("Authentification error, please logout and login again.");
      return;
    }
    try {
      const response = await axios.post(
        userLogged
          ? `${process.env.REACT_APP_API_URL}orders/stripe/create`
          : `${process.env.REACT_APP_API_URL}orders/stripe/guest/create`,
        orderDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the successful response here, e.g., show a success message to the user
      console.log(response.data.message);
      console.log(response.data.order);
      localStorage.removeItem("cartTickets");
      localStorage.removeItem("cartEvent");
      localStorage.removeItem("ticketsDate");
      toast.success("Payment successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      // Handle any network or other errors here
      if (error.response) {
        // The request was made, but the server responded with an error status
        console.error(
          `Error response: ${error.response.status} - ${error.response.data}`
        );
        toast.error("An error has occured, please try again.");
        setBtnDisabled(false);
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No response received from the server");
        toast.error("Server not responding, please try again later.");
        setBtnDisabled(false);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up the request:", error.message);
        toast.error("Something went while sending request, please try again.");
        setBtnDisabled(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    setBtnClicked(true);

    const paymentElement = elements.getElement(PaymentElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "payment",
      payment_method: {
        payment_method: paymentElement,
      },
    });

    if (error) {
      console.error(error);
      toast.error(
        "An error has occurred, please verify your payment details and try again."
      );
      setBtnDisabled(false);
    } else {
      const orderDetails = {
        eventId: order.eventId,
        items: order.items,
        participantDetails: order.participantDetails,
        validityStartDate: order.validityStartDate,
        validityEndDate: order.orderTicketsDate,
        validityStartTime: "11:00:00",
        validityEndTime: "20:00:00",
        paymentMethod: paymentMethod.id,
      };
      // Use paymentMethod.id to handle the payment on the server
      createOrderWithStripeClient(orderDetails);
    }
  };
  // eslint-disable-next-line
  const cardStyle = {
    payment: {
      color: "#bdcaf7",
      fontFamily: '"TT Commons", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#bdcaf7",
      iconColor: "#bdcaf7",
    },
  };

  return (
    <form className="mt-3 _card_details" onSubmit={handleSubmit}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ExpressCheckoutElement
        className="mb-4 card_input"
        options={{
          wallets: {
            applePay: "always",
            googlePay: "always",
          },
        }}
      />
    </form>
  );
};

export default ApplePaymentForm;
