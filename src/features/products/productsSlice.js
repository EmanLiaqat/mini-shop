import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Normalize both APIs to the same shape
const normalizeFakeStore = (p) => ({
  id: `fs-${p.id}`,
  title: p.title,
  price: p.price,
  category: p.category,
  image: p.image,
  description: p.description,
  rating: p.rating?.rate || 4.5,
  reviews: p.rating?.count || 100,
});

const normalizeDummyJSON = (p) => ({
  id: `dj-${p.id}`,
  title: p.title,
  price: p.price,
  category: p.category,
  image: p.thumbnail,
  description: p.description,
  rating: p.rating || 4.5,
  reviews: Math.floor(Math.random() * 400) + 50,
});

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const [fakeRes, dummyRes] = await Promise.all([
        fetch("https://fakestoreapi.com/products"),
        fetch("https://dummyjson.com/products?limit=20"),
      ]);
      if (!fakeRes.ok || !dummyRes.ok) throw new Error("Failed to fetch products");

      const fakeData = await fakeRes.json();
      const dummyData = await dummyRes.json();

      const fakeProducts = fakeData.map(normalizeFakeStore);
      const dummyProducts = dummyData.products.map(normalizeDummyJSON);

      // Combine and remove near-duplicates by title
      const seen = new Set();
      const all = [...fakeProducts, ...dummyProducts].filter((p) => {
        const key = p.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return all; // ~40 products
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;