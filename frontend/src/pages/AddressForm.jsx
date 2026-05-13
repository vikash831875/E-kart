import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  addAddress,
  setSelectedAddress,
  deleteAddress,
} from "@/redux/productSlice";

const AddressForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { addresses = [], selectedAddress, cart } = useSelector(
    (store) => store.product
  );

  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0;

  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [showForm, setShowForm] = useState(
    addresses.length > 0 ? false : true
  );

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SAVE ADDRESS
  const handleSubmit = (e) => {
    e.preventDefault();

    // ADD ADDRESS
    dispatch(addAddress(formData));

    // SELECT ADDRESS
    dispatch(setSelectedAddress(formData));

    // RESET FORM
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });

    // SHOW ADDRESS LIST
    setShowForm(false);
  };

  // HANDLE DELETE
  const handleDelete = (e, index) => {
    e.stopPropagation();

    dispatch(deleteAddress(index));
  };

  // HANDLE PAYMENT
  const handlePayment = () => {
    if (!selectedAddress) {
      alert("Please Select Address");
      return;
    }

    navigate("/payment");
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="bg-white shadow-lg rounded-xl p-6">

          {/* SAVED ADDRESSES */}
          {addresses.length > 0 && !showForm ? (
            <div className="space-y-4">

              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Saved Addresses
                </h2>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Add New
                </button>
              </div>

              {/* ADDRESS LIST */}
              {addresses.map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    dispatch(setSelectedAddress(item))
                  }
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddress === item
                      ? "border-black bg-gray-100"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">

                    {/* LEFT CONTENT */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {item.fullName}
                      </h3>

                      <p>{item.phone}</p>

                      <p>{item.email}</p>

                      <p>{item.address}</p>

                      <p>
                        {item.city}, {item.state} - {item.zip}
                      </p>

                      <p>{item.country}</p>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={(e) =>
                        handleDelete(e, index)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* PAYMENT BUTTON */}
              <button
                onClick={handlePayment}
                className="w-full bg-black text-white py-3 rounded-lg mt-5"
              >
                Proceed To Payment
              </button>
            </div>
          ) : (
            /* ADDRESS FORM */
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <h2 className="text-2xl font-bold">
                Add Address
              </h2>

              {/* FULL NAME */}
              <div>
                <Label htmlFor="fullName">
                  Full Name
                </Label>

                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* PHONE */}
              <div>
                <Label htmlFor="phone">
                  Phone
                </Label>

                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <Label htmlFor="email">
                  Email
                </Label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <Label htmlFor="address">
                  Address
                </Label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* CITY */}
              <div>
                <Label htmlFor="city">
                  City
                </Label>

                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Delhi"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* STATE */}
              <div>
                <Label htmlFor="state">
                  State
                </Label>

                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Uttar Pradesh"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* ZIP */}
              <div>
                <Label htmlFor="zip">
                  ZIP Code
                </Label>

                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="244001"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* COUNTRY */}
              <div>
                <Label htmlFor="country">
                  Country
                </Label>

                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4">

                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg"
                >
                  Save And Continue
                </button>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-md h-fit">

          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* SELECTED ADDRESS */}
          {selectedAddress && (
            <div className="mt-6 bg-white p-4 rounded-lg border">

              <h3 className="font-bold mb-2">
                Selected Address
              </h3>

              <p>{selectedAddress.fullName}</p>

              <p>{selectedAddress.phone}</p>

              <p>{selectedAddress.address}</p>

              <p>
                {selectedAddress.city}, {selectedAddress.state}
              </p>
            </div>
          )}

          {/* PAYMENT BUTTON */}
          <button
            onClick={handlePayment}
            className="w-full bg-black text-white py-3 rounded-lg mt-6"
          >
            Proceed To Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;