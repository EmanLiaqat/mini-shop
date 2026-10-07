import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../features/cart/cartSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-indigo-100"
    }`;

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          🛍️ MiniShop
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Shop
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;