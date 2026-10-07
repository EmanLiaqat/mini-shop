import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const save = (items) => localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
      save(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      save(state.items);
    },
    incrementQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
      save(state.items);
    },
    decrementQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0)
          state.items = state.items.filter((i) => i.id !== action.payload);
      }
      save(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      save([]);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;

export const selectCartCount = (s) =>
  s.cart.items.reduce((sum, i) => sum + i.qty, 0);

export const selectCartTotal = (s) =>
  s.cart.items.reduce((sum, i) => sum + i.qty * i.price, 0);

export default cartSlice.reducer;