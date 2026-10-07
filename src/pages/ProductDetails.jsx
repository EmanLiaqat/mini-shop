import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((s) =>
    s.products.items.find((p) => p.id === (id))
  );
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link to="/" className="text-indigo-600 underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 text-sm mb-4"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow overflow-hidden grid md:grid-cols-2">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 md:h-full object-contain p-8 bg-gray-50"
        />
        <div className="p-6 flex flex-col">
          <span className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">
            {product.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
            {product.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ⭐ {product.rating?.rate} • {product.rating?.count} reviews
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            {product.description}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <label className="text-sm text-gray-600">Qty</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg"
              >
                −
              </button>
              <span className="px-3">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Add {qty} to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;