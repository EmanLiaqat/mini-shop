import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center py-20">
    <p className="text-7xl mb-4">🛍️</p>
    <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
    <p className="text-gray-600 mb-6">This page doesn't exist.</p>
    <Link to="/" className="text-indigo-600 underline">
      Back to Shop
    </Link>
  </div>
);

export default NotFound;