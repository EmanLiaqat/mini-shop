import { createSlice } from "@reduxjs/toolkit";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: load() },
  reducers: {
    placeOrder: (state, action) => {
      state.items.unshift(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.items));
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;