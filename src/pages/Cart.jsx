import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
  selectCartTotal,
} from "../features/cart/cartSlice";

const Cart = () => {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
          <p className="text-7xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total > 50 ? 0 : 5;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Shopping Cart
        <span className="text-base font-normal text-gray-500 ml-2">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain bg-gray-50 rounded-xl p-2"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-gray-800 hover:text-indigo-600 line-clamp-1">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">
                  ${item.price.toFixed(2)} each
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => dispatch(decrementQty(item.id))}
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch(incrementQty(item.id))}
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-sm text-red-500 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-emerald-600">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg mb-5">
            <span>Total</span>
            <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Proceed to Checkout →
          </Link>
          <Link
            to="/"
            className="block text-center text-sm text-gray-500 hover:text-indigo-600 mt-3"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;