"use client";

import { Suspense } from "react";
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

  const handlePaymentSuccess = async (result: AuthResult) => {
    try {
      // Update status to show processing
      const statusElement = document.getElementById("checkout-status");
      if (statusElement) {
        statusElement.textContent = "Processing payment...";
        statusElement.className = "text-sm text-center py-2 text-blue-600";
      }

      // Log the authentication result for debugging
      console.log("Authentication successful with token:", result.token);

      // Call API route to process the payment with the token
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: result.token,
          email: result.email,
          userId: result.userId,
          orderId: "12345",
          amount: 99.99,
        }),
      });

      // Check if the response was ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Server error: ${response.status}`;
        console.error("Payment processing failed:", errorMessage);

        if (statusElement) {
          statusElement.textContent = `Payment failed: ${errorMessage}`;
          statusElement.className = "text-sm text-center py-2 text-red-600";
        }
        return;
      }

      const data = await response.json();

      if (statusElement) {
        if (data.success) {
          // Show success message (in production, redirect to success page)
          statusElement.textContent = `Payment successful! Order #${data.orderId}`;
          statusElement.className =
            "text-sm text-center py-2 text-green-600 font-medium";
        } else {
          // Handle error
          statusElement.textContent = `Payment failed: ${
            data.error || "Unknown error"
          }`;
          statusElement.className = "text-sm text-center py-2 text-red-600";
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      const statusElement = document.getElementById("checkout-status");
      if (statusElement) {
        statusElement.textContent =
          "Payment processing error. Please try again.";
        statusElement.className = "text-sm text-center py-2 text-red-600";
      }
    }
  };

  return (
    <div className="space-y-4">
      <PayAuthButton
        merchantId="DEMO_MERCHANT_123"
        buttonText="Complete Purchase with Passkey"
        onSuccess={handlePaymentSuccess}
        onError={(error) => {
          console.error("Authentication error:", error);
          const statusElement = document.getElementById("checkout-status");
          if (statusElement) {
            statusElement.textContent = `Authentication failed: ${error.message}`;
            statusElement.className = "text-sm text-center py-2 text-red-600";
          }
        }}
        onCancel={() => {
          const statusElement = document.getElementById("checkout-status");
          if (statusElement) {
            statusElement.textContent =
              "Authentication cancelled. You can try again when ready.";
            statusElement.className =
              "text-sm text-center py-2 text-yellow-600";
          }
        }}
      />
      <div id="checkout-status" className="text-sm text-center py-2"></div>
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
