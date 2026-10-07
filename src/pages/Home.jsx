import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const [visible, setVisible] = useState(PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const visibleProducts = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <div>
      {/* ===== HERO (compact) ===== */}
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
            <a
              href="#products"
              className="inline-block bg-white text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition shadow-sm"
            >
              Start Shopping →
            </a>
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
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Featured Products
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Handpicked just for you
            </p>
          </div>
          {status === "succeeded" && (
            <span className="text-xs text-gray-500">
              Showing {visibleProducts.length} of {items.length}
            </span>
          )}
        </div>

        {status === "loading" && <Loader label="Loading products..." />}

        {status === "failed" && (
          <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />
        )}

        {status === "succeeded" && (
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
                  {items.length - visible} more available
                </p>
              </div>
            )}

            {!hasMore && items.length > 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">
                🎉 You've seen all {items.length} products!
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;