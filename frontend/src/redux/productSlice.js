import { createSlice } from "@reduxjs/toolkit";

// LOAD FROM LOCALSTORAGE
const savedAddresses =
  JSON.parse(localStorage.getItem("addresses")) || [];

const savedSelectedAddress =
  JSON.parse(localStorage.getItem("selectedAddress")) || null;

const productSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    cart: null,
    addresses: savedAddresses,
    selectedAddress: savedSelectedAddress,
  },

  reducers: {
    // PRODUCTS
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // CART
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // ADD ADDRESS
    addAddress: (state, action) => {
      state.addresses.push(action.payload);

      // SAVE TO LOCALSTORAGE
      localStorage.setItem(
        "addresses",
        JSON.stringify(state.addresses)
      );
    },

    // SELECT ADDRESS
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;

      // SAVE SELECTED ADDRESS
      localStorage.setItem(
        "selectedAddress",
        JSON.stringify(action.payload)
      );
    },

    // DELETE ADDRESS
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload
      );

      // UPDATE LOCALSTORAGE
      localStorage.setItem(
        "addresses",
        JSON.stringify(state.addresses)
      );

      // RESET SELECTED ADDRESS IF DELETED
      if (
        JSON.stringify(state.selectedAddress) ===
        JSON.stringify(
          state.addresses[action.payload]
        )
      ) {
        state.selectedAddress = null;

        localStorage.removeItem(
          "selectedAddress"
        );
      }
    },
  },
});

// EXPORTS
export const {
  setProducts,
  setCart,
  addAddress,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;

export default productSlice.reducer;