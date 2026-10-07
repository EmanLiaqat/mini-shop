import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../features/cart/cartSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);
  const products = useSelector((s) => s.products.items);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Get unique categories from products
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkClass = ({ isActive }) =>
    `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  const handleCategoryClick = (category) => {
    setOpen(false);
    if (category === "All") {
      navigate("/");
    } else {
      navigate(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-xl">🛍️</span>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MiniShop
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>

          {/* Categories dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                open
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              Categories
              <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeInUp">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition capitalize"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <NavLink to="/cart" className={linkClass}>
            <span className="flex items-center gap-1.5">
              🛒 Cart
              {cartCount > 0 && (
                <span className="bg-pink-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;