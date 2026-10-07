import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../features/cart/cartSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);

  const linkClass = ({ isActive }) =>
    `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-xl">🛍️</span>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MiniShop
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>Shop</NavLink>
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