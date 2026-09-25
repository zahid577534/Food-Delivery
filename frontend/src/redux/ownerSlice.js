import { createSlice } from "@reduxjs/toolkit";

const savedShops =
  localStorage.getItem("shops");

let initialShops = [];

try {
  initialShops = savedShops
    ? JSON.parse(savedShops)
    : [];
} catch (error) {
  console.error(
    "Invalid shops data in localStorage:",
    error
  );

  localStorage.removeItem("shops");

  initialShops = [];
}

const ownerSlice = createSlice({
  name: "owner",

  initialState: {
    myShops: initialShops,
  },

  reducers: {
    setMyShops(state, action) {
      state.myShops = action.payload;

      localStorage.setItem(
        "shops",
        JSON.stringify(action.payload)
      );
    },

    setCity(state, action) {
      state.city = action.payload;
    },

    logout(state) {
      state.myShops = [];

      localStorage.removeItem("shops");
      localStorage.removeItem("token");
    },
  },
});

export const {
  setMyShops,
  setCity,
  logout,
} = ownerSlice.actions;

export default ownerSlice.reducer;