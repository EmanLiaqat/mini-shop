import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const { id } = useParams();
  const order = useSelector((s) =>
    s.orders.items.find((o) => o.id === id)
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <p className="text-6xl mb-3">✅</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-600 mb-1">
          Order ID: <span className="font-mono">{id}</span>
        </p>
        {order && (
          <>
            <p className="text-gray-600 mb-1">
              Total paid: <strong>${order.total.toFixed(2)}</strong>
            </p>
            <p className="text-gray-600 mb-5">
              Confirmation sent to {order.customer.email}.
            </p>
          </>
        )}
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;