import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";

const OrderSuccessful = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleViewOrders = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
      return;
    }

    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* HEADING */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successful!
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
          You will receive an email confirmation shortly.
        </p>

        {/* BUTTONS */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={handleViewOrders}
            className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            View Order History
          </button>
        </div>

        {/* ORDER DETAILS NOTE */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Order Details:</strong> You can track your order status and view details in your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessful;