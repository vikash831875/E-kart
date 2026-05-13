import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import { setCart } from "@/redux/productSlice";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectedAddress = useSelector(
    (store) => store.product.selectedAddress
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select a shipping address before paying.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Your cart is empty or amount is invalid.");
      return;
    }

    if (!stripe || !elements) {
      alert("Stripe has not loaded yet. Please wait a moment.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/payment/create-payment-intent",
        {
          amount: Math.round(amount),
        }
      );

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const tax = Number((amount * 0.05).toFixed(2));
        const shippingPrice = 0;
        const orderRes = await axios.post(
          "http://localhost:8000/api/v1/order/create",
          {
            shippingAddress: selectedAddress,
            paymentIntentId: result.paymentIntent.id,
            tax,
            shippingPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (orderRes.data.success) {
          alert("Payment successful and order created.");
          dispatch(setCart({ items: [], totalPrice: 0 }));
          navigate("/order-successful");
          return;
        }

        alert(orderRes.data.message || "Order creation failed.");
      }
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  const displayAmount = amount ? Math.round(amount) : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <CardElement className="border p-4 rounded-lg" />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-3 rounded-lg mt-5"
      >
        {loading ? "Processing..." : `Pay ₹${displayAmount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;