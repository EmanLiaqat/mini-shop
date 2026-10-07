const Loader = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

export default Loader;