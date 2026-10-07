import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectCartTotal, clearCart } from "../features/cart/cartSlice";
import { placeOrder } from "../features/orders/ordersSlice";

// ✅ Expiry validates as "YYYY-MM" (native <input type="month"> format)
// ✅ Must be current month or later
const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  zip: z.string().regex(/^\d{4,6}$/, "Enter a valid ZIP/postal code"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Please pick an expiry month")
    .refine((val) => {
      if (!/^\d{4}-\d{2}$/.test(val)) return false;
      const [year, month] = val.split("-").map(Number);
      const now = new Date();
      const expiryDate = new Date(year, month, 0, 23, 59, 59);
      return expiryDate >= now;
    }, "Card has expired"),
});

const Checkout = () => {
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    const order = {
      id: `ORD-${Date.now()}`,
      customer: data,
      items,
      total,
      placedAt: new Date().toISOString(),
    };
    dispatch(placeOrder(order));
    dispatch(clearCart());
    navigate(`/order-success/${order.id}`);
  };

  const Input = ({ label, name, type = "text", ...rest }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        {...rest}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
          Shipping Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" name="fullName" placeholder="Jane Doe" />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="jane@mail.com"
          />
          <Input label="Phone" name="phone" placeholder="+92 300 1234567" />
          <Input label="City" name="city" placeholder="Lahore" />
        </div>
        <Input label="Address" name="address" placeholder="House #, Street" />
        <Input label="ZIP / Postal Code" name="zip" placeholder="54000" />

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
          Payment Details
        </h2>
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="1234567812345678"
          maxLength={16}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiry"
            type="month"
            min={new Date().toISOString().slice(0, 7)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
        >
          {isSubmitting
            ? "Processing..."
            : `Place Order • $${total.toFixed(2)}`}
        </button>
      </form>

      <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm gap-2">
              <span className="truncate text-gray-700">
                {i.title} <span className="text-gray-400">× {i.qty}</span>
              </span>
              <span className="font-medium">${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-dashed" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
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
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (5%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;