import React from "react";
import { useSelector } from "react-redux";

import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51TVng17WyiVc4neBhH7VSHdHIBNnAdEj4wvJiJah2G5zT4ahWnjmdgc1W4pUu5QwxiM67PCGHQAn6vdrOnTQUfwR00EpERJ9nd"
);

const PaymentPage = () => {
  const { cart } = useSelector((store) => store.product);
  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADING */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Secure Checkout
          </h1>

          <p className="text-gray-500 mt-3">
            Complete your payment securely using Stripe
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Payment Details
            </h2>

            <Elements stripe={stripePromise}>
              <CheckoutForm amount={total} />
            </Elements>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">

            <h2 className="text-2xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const product = item.productId;

                  return (
                    <div
                      key={product?._id || item._id}
                      className="flex items-start justify-between gap-4 border-b pb-4"
                    >
                      <div>
                        <p className="font-medium">
                          {product?.productName || "Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No items in your cart yet.</p>
              )}

              <div className="flex justify-between pt-4 text-gray-600">
                <span>Product Price</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {/* SECURITY */}
              <div className="bg-green-100 text-green-700 p-4 rounded-xl mt-6">
                🔒 100% Secure Payment powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;