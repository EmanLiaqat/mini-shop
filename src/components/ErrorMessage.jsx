const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md mx-auto my-8 text-center">
    <p className="font-semibold mb-2">Something went wrong</p>
    <p className="text-sm mb-4">{message || "Unexpected error"}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;