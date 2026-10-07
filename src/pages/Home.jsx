
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../features/products/productsSlice";
import { selectCartCount, selectCartTotal } from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const PRODUCTS_PER_PAGE = 12;

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide truncate">{label}</p>
      <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
    </div>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  const orderCount = useSelector((s) => s.orders.items.length);

  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") || "All";
  const searchQuery = params.get("q") || "";

  // Local state for search input (so typing feels instant)
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [visible, setVisible] = useState(PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisible(PRODUCTS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  // Sync search input if URL query changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Build category list
  const categories = ["All", ...new Set(items.map((p) => p.category))];

  // Filter products
  const filtered = items.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleProducts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (searchInput.trim()) newParams.q = searchInput.trim();
    if (activeCategory !== "All") newParams.category = activeCategory;
    setParams(newParams);
  };

  const handleCategoryClick = (cat) => {
    const newParams = {};
    if (cat !== "All") newParams.category = cat;
    if (searchQuery) newParams.q = searchQuery;
    setParams(newParams);
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-medium mb-3">
              ✨ Fresh deals every day
            </span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
              Discover amazing products at{" "}
              <span className="bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
                MiniShop
              </span>
            </h1>
            <p className="text-sm md:text-base text-white/70 mb-5 max-w-lg">
              Shop the latest trends in electronics, fashion, and more — delivered fast.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon="📦"
            label="Products"
            value={items.length || "—"}
            color="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            icon="🧺"
            label="Cart Items"
            value={cartCount}
            color="bg-pink-50 text-pink-600"
          />
          <StatCard
            icon="💰"
            label="Cart Value"
            value={`$${cartTotal.toFixed(0)}`}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon="✅"
            label="Orders Placed"
            value={orderCount}
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section id="products" className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
          Our Products
        </h2>
        <p className="text-gray-500 text-xs mb-5">
          Browse by category or search for anything
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products (shirt, bracelet, chair...)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            Search
          </button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition capitalize ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        {status === "succeeded" && (
          <p className="text-xs text-gray-500 mb-4">
            Showing {visibleProducts.length} of {filtered.length}{" "}
            {filtered.length === 1 ? "product" : "products"}
            {activeCategory !== "All" && (
              <>
                {" "}in <span className="font-medium text-indigo-600">{activeCategory}</span>
              </>
            )}
            {searchQuery && (
              <>
                {" "}matching "<span className="font-medium">{searchQuery}</span>"
              </>
            )}
          </p>
        )}

        {status === "loading" && <Loader label="Loading products..." />}

        {status === "failed" && (
          <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />
        )}

        {status === "succeeded" && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-gray-600 font-medium mb-1">No products found</p>
            <p className="text-sm text-gray-400 mb-4">
              Try a different search or category
            </p>
            <button
              onClick={() => {
                setParams({});
                setSearchInput("");
              }}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {status === "succeeded" && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PRODUCTS_PER_PAGE)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition active:scale-95"
                >
                  Load More Products ↓
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  {filtered.length - visible} more available
                </p>
              </div>
            )}

            {!hasMore && (
              <p className="text-center text-gray-400 text-sm mt-10">
                🎉 You've seen all {filtered.length} products!
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;