import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-amber-500">
        {"★".repeat(full)}
        {half && "☆"}
        {"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span className="text-gray-500 font-medium">{rating?.toFixed(1)}</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="group bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 animate-fadeInUp">
      {/* Colored top accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <Link
        to={`/product/${product.id}`}
        className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-44 object-contain p-5 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-white/95 backdrop-blur text-[10px] uppercase tracking-wider text-indigo-600 font-bold px-2 py-0.5 rounded-full shadow-sm border border-indigo-100">
          {product.category?.slice(0, 12)}
        </span>
      </Link>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 text-[13px] leading-snug hover:text-indigo-600 line-clamp-2 min-h-[2.4rem]">
              {product.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <Stars rating={product.rating} />
            <span className="text-[10px] text-gray-400">{product.reviews}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
          <span className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;