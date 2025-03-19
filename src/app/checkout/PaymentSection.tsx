"use client";

import { useState } from "react";
import PayAuthButton from "@/components/PayAuthButton";

export default function PaymentSection() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  return (
    <div className="mt-6">
      {paymentStatus ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          {paymentStatus}
        </div>
      ) : (
        <PayAuthButton
          merchantId="DEMO_MERCHANT_123"
          onSuccess={(result) => {
            // Process payment with your API
            fetch("/api/process-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: result.userId,
                email: result.email,
                token: result.token,
                amount: 99.99,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                setPaymentStatus(`Payment successful! Order #${data.orderId}`);
              })
              .catch((err) => {
                console.error("Payment processing error:", err);
                alert("Payment processing failed.");
              });
          }}
          onError={(error) => {
            console.error("Authentication error:", error);
            alert(`Authentication failed: ${error.message}`);
          }}
          onCancel={() => {
            console.log("Authentication cancelled by user");
            setPaymentStatus("Payment cancelled. Please try again.");
            setTimeout(() => setPaymentStatus(null), 3000);
          }}
          theme="light"
          buttonText="Pay with Passkey"
        />
      )}
    </div>
  );
}
