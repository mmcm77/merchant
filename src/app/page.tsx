"use client";

import { Suspense, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PayAuthButton from "@/components/PayAuthButton";
import { AuthResult } from "@/components/PayAuthButton";

// Client component wrapper to handle payment processing
function CheckoutPayment() {
  "use client";

  const [status, setStatus] = useState("");

  const handlePaymentSuccess = async (result: AuthResult) => {
    try {
      console.log("Authentication successful with token:", result.token);
      setStatus("Processing payment...");

      // Call API to process payment with token
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: result.token,
          userId: result.userId,
          email: result.email,
          orderId: "ORDER-" + Math.floor(Math.random() * 1000),
          amount: 99.99,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as { error: string };
        throw new Error(errorData.error || "Payment processing failed");
      }

      setStatus("Payment successful! Order ID: " + data.orderId);
    } catch (error) {
      console.error("Payment error:", error);
      setStatus(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="mt-8">
      <PayAuthButton
        merchantId="DEMO_MERCHANT_123"
        apiToken="payauth_test_tk_3f7c9a1b5d8e2f4a6c0b9d8e2f4a6c0b9d8e2f4a"
        buttonText="Complete Purchase with Passkey"
        onSuccess={handlePaymentSuccess}
        onError={(error) => {
          console.error("Authentication error:", error);
          setStatus(`Authentication error: ${error.message}`);
        }}
        onCancel={() => setStatus("Authentication cancelled")}
      />

      {status && (
        <div className="mt-4 p-4 rounded-md bg-slate-100 dark:bg-slate-800">
          <p
            className={`text-sm ${
              status.includes("failed") || status.includes("error")
                ? "text-red-500"
                : ""
            }`}
          >
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Simple Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your order before payment</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/50">
            <div>
              <h3 className="font-medium">Premium Plan</h3>
              <p className="text-sm text-muted-foreground">
                Monthly Subscription
              </p>
            </div>
            <span className="font-medium">$99.99</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$99.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t mt-2">
              <span>Total</span>
              <span>$99.99</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="w-full border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-4">Payment Method</h3>
            <Suspense
              fallback={
                <div className="text-center py-4">
                  Loading payment options...
                </div>
              }
            >
              <CheckoutPayment />
            </Suspense>
          </div>

          <div className="text-xs text-center text-muted-foreground mt-4">
            Your data is secure and encrypted
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
