import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: JSON.parse(localStorage.getItem("shop")) || null,
    
  },
  reducers: {
  setMyShopData(state, action) {
  state.myShopData = action.payload;
  localStorage.setItem(
    "shop",
    JSON.stringify(action.payload)
  );

    },
    setCity(state, action) {
      state.city = action.payload;
    },
  logout(state) {
  state.myShopData = null;
  localStorage.removeItem("shop");
  localStorage.removeItem("token");
}
  },
});

export const { setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;