import React, { useEffect, useState } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const ApplePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Demo total",
        amount: 1999,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      paymentMethod: {
        supportedMethods: "https://apple.com/apple-pay",
      },
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (e) => {
      const { error: backendError, clientSecret } = await fetch(
        `${process.env.REACT_APP_API_URL}orders/stripe/createIntent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodType: "apple_pay",
            currency: "usd",
            // Include any other necessary parameters for Apple Pay
          }),
        }
      ).then((r) => r.json());

      if (backendError) {
        console.error("Backend error:", backendError.message);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: e.paymentMethod.id,
          },
          { handleActions: false }
        );

      if (stripeError) {
        console.error("Stripe error:", stripeError.message);
        return;
      }

      console.log(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    });
  }, [stripe, elements]);

  return (
    <>
      {paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
    </>
  );
};

export default ApplePaymentForm;
