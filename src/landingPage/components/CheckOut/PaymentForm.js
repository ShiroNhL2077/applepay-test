// Import necessary dependencies
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./PaymentForm.css";

// Create the CheckoutForm component
const PaymentForm = ({ order, userLogged }) => {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  // const [cardZipCode, setCardZipCode] = useState("");

  const [btnDisabled, setBtnDisabled] = useState(false);
  // eslint-disable-next-line
  const [btnClicked, setBtnClicked] = useState(false);

  const createOrderWithStripeClient = async (oD) => {
    const token = localStorage.getItem("token");
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
        oD,
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

    const cardNumberElement = elements.getElement(CardNumberElement);
    // eslint-disable-next-line
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    // eslint-disable-next-line
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      console.error(error);
      toast.error(
        "An error has occurred, please verify your card details and try again."
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

  const cardStyle = {
    base: {
      color: "#000",
      fontFamily: '"TT Commons", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#000",
      },
    },
    invalid: {
      color: "#000",
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
      <div className="row">
        <div className="card-detail-input ">
          <CardNumberElement
            className="mb-4 card_input"
            options={{ style: cardStyle }}
          />
        </div>
        <div className="card-detail-input col-xl-6">
          <CardExpiryElement
            className="mb-4 card_input"
            options={{ style: cardStyle }}
          />
        </div>
        <div className="card-detail-input col-xl-6">
          <CardCvcElement
            className="mb-4 card_input"
            options={{ style: cardStyle }}
          />
        </div>
        {/* <div className="col-xl-4">
          <InputGroup className="mb-4 _input card_zip_input">
            <Form.Control
              placeholder="Zip code"
              aria-label="zip-code"
              aria-describedby="zip-code"
              value={cardZipCode}
              maxLength={5}
              onChange={(e) => setCardZipCode(e.target.value)}
              // onKeyPress={handleKeyPress}
            />
          </InputGroup>
        </div> */}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button
          type="submit"
          className="btn stripe_pay_btn"
          disabled={!stripe || btnDisabled}
        >
          Pay
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
