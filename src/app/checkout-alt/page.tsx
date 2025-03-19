"use client";

import { useState } from "react";
import PayAuthButton from "@/components/PayAuthButton";
import { AuthResult } from "@/components/PayAuthButton";

export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSuccess = (result: AuthResult) => {
    console.log("Payment authorized:", result);
    setPaymentStatus(`Payment authorized for: ${result.email}`);
  };

  const handleError = (error: Error) => {
    console.error("Authentication error:", error);
    alert(`Authentication failed: ${error.message}`);
  };

  const handleCancel = () => {
    console.log("Authentication cancelled by user");
    alert("Authentication cancelled");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="credit-card"
                name="payment-method"
                className="mr-2"
                defaultChecked
              />
              <label htmlFor="credit-card" className="font-medium">
                Credit Card
              </label>
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm text-gray-500">
              Credit card form placeholder
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="passkey-standard"
                name="payment-method"
                className="mr-2"
              />
              <label htmlFor="passkey-standard" className="font-medium">
                Pay with Passkey
              </label>
            </div>
            <div className="mt-3">
              {paymentStatus ? (
                <div className="p-3 bg-green-100 text-green-800 rounded-lg mb-4">
                  {paymentStatus}
                </div>
              ) : (
                <PayAuthButton
                  merchantId="DEMO_MERCHANT_123"
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onCancel={handleCancel}
                  theme="light"
                  buttonText="Pay with Passkey"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
