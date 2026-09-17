import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
  },

  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },

    setCurrentCity(state, action) {
      state.currentCity = action.payload;
    },

    setCurrentState(state, action) {
      state.currentState = action.payload;
    },

    setCurrentAddress(state, action) {
      state.currentAddress = action.payload;
    },

    logout(state) {
      state.user = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const {
  setUser,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  logout,
} = userSlice.actions;

export default userSlice.reducer;