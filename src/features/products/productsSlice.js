import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_PRODUCTS } from "../../data/products";

// ============ NORMALIZERS ============
const normalizeFakeStore = (p) => ({
  id: `fs-${p.id}`,
  title: p.title,
  price: p.price,
  category:
    p.category.charAt(0).toUpperCase() + p.category.slice(1).replace("'", "'"),
  image: p.image,
  description: p.description,
  rating: p.rating?.rate || 4.5,
  reviews: p.rating?.count || 100,
});

const normalizeDummyJSON = (p) => ({
  id: `dj-${p.id}`,
  title: p.title,
  price: p.price,
  category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
  image: p.thumbnail,
  description: p.description,
  rating: p.rating || 4.5,
  reviews: Math.floor(Math.random() * 400) + 50,
});

// ============ CACHE HELPERS ============
const CACHE_KEY = "minishop_products";
const CACHE_TIME_KEY = "minishop_products_time";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const ts = localStorage.getItem(CACHE_TIME_KEY);
    if (!cached || !ts) return null;
    if (Date.now() - Number(ts) > CACHE_DURATION) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const setCache = (products) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
  } catch {
    // ignore
  }
};

// ============ MAIN THUNK: API first → cache → local fallback ============
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    // 1️⃣ Try cache (instant)
    const cached = getCache();
    if (cached && cached.length > 0) {
      console.log("✅ Using cached products:", cached.length);
      return cached;
    }

    // 2️⃣ Try API
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const [fakeRes, dummyRes] = await Promise.allSettled([
        fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        }),
        fetch("https://dummyjson.com/products?limit=20", {
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeout);

      let apiProducts = [];

      if (fakeRes.status === "fulfilled" && fakeRes.value.ok) {
        const data = await fakeRes.value.json();
        apiProducts = [...apiProducts, ...data.map(normalizeFakeStore)];
        console.log("✅ Fake Store API loaded:", data.length);
      } else {
        console.warn("⚠️ Fake Store API failed");
      }

      if (dummyRes.status === "fulfilled" && dummyRes.value.ok) {
        const data = await dummyRes.value.json();
        apiProducts = [...apiProducts, ...data.products.map(normalizeDummyJSON)];
        console.log("✅ DummyJSON loaded:", data.products.length);
      } else {
        console.warn("⚠️ DummyJSON failed");
      }

      // 3️⃣ If API gave us products → merge with local (bigger catalog) + cache
      if (apiProducts.length > 0) {
        const merged = [...apiProducts, ...LOCAL_PRODUCTS];
        setCache(merged);
        console.log("💾 Cached merged products:", merged.length);
        return merged;
      }

      // 4️⃣ Both APIs failed → use local products
      console.warn("❌ All APIs failed — using local products");
      return LOCAL_PRODUCTS;
    } catch (err) {
      // 5️⃣ Any network error → local products
      console.error("❌ API error:", err.message);
      return LOCAL_PRODUCTS;
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    clearProductsCache: () => {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
      console.log("🗑️ Cache cleared");
    },
  },
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

export const { clearProductsCache } = productsSlice.actions;
export default productsSlice.reducer;