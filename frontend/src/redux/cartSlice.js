
import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(
  localStorage.getItem("cart")
) || [];

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: savedCart,
  },

  reducers: {
   addToCart: (state, action) => {
  const newItem = action.payload;

  if (state.items.length > 0) {
    const existingShopId = state.items[0].shopId;

    if (existingShopId !== newItem.shopId) {
      return;
    }
  }

  const existingItem = state.items.find(
    (item) => item.itemId === newItem.itemId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({
      ...newItem,
      quantity: 1,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(state.items)
  );
},

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.itemId !== action.payload
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(state.items)
      );
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.itemId === action.payload
      );

      if (item) {
        item.quantity += 1;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(state.items)
      );
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.itemId === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(state.items)
      );
    },

    clearCart: (state) => {
      state.items = [];

      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

