import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col transition">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain p-4 bg-gray-50"
          loading="lazy"
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 mt-1 mb-1 hover:text-indigo-600 line-clamp-2">
              {product.title}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="bg-indigo-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;