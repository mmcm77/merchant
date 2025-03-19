import PaymentSection from "./PaymentSection";

export default function CheckoutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Order summary and other server-rendered content */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p className="text-gray-600">Premium Plan Subscription</p>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold">$99.99</span>
        </div>
      </div>

      {/* Payment section with client components */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <PaymentSection />
      </div>
    </div>
  );
}
