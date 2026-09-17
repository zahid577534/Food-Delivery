import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import ownerReducer from "./ownerSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer,
    cart: cartReducer,
  },
});