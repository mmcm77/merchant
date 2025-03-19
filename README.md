# PayAuth SDK Demo

This is a Next.js demo application that showcases the integration of the PayAuth SDK for passkey-based authentication and payments.

## Overview

This demo app demonstrates how to integrate the PayAuth SDK into a Next.js application to enable passkey-based authentication for payments. The implementation follows the official SDK documentation to provide a clean, reliable integration. The application includes:

- A client-side PayAuthButton component that loads and initializes the PayAuth SDK
- A checkout page showing how to use the PayAuth SDK in a payment flow
- A mock API endpoint for processing payments

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the demo application.

## SDK Integration Details

The implementation follows the official Next.js integration guide from the PayAuth SDK documentation:

1. **PayAuthButton Component**: A client component that:

   - Dynamically loads the SDK script
   - Initializes the SDK with your merchant ID and options
   - Handles authentication events
   - Provides callbacks for success, error, and cancellation

2. **Checkout Page Pattern**:

   - Uses a client component wrapper for the SDK integration
   - Demonstrates proper separation of server and client components
   - Implements a complete checkout flow with order summary and payment processing

3. **API Route for Payment Processing**:
   - Shows how to process the authentication token
   - Demonstrates payment verification flow (simulated)
   - Returns appropriate success/error responses

## Implementation Pattern

The pattern used in this demo follows Next.js best practices:

```tsx
// Client component wrapper
function CheckoutPayment() {
  "use client";

  const handlePaymentSuccess = async (result) => {
    // Process payment with your backend
  };

  return (
    <PayAuthButton
      merchantId="YOUR_MERCHANT_ID"
      buttonText="Complete Purchase with Passkey"
      onSuccess={handlePaymentSuccess}
      onError={(error) => {
        /* Handle errors */
      }}
      onCancel={() => {
        /* Handle cancellation */
      }}
    />
  );
}

// Server component
export default function CheckoutPage() {
  return (
    <div>
      {/* Order summary - server component content */}
      <div>
        <h2>Order Summary</h2>
        {/* Content... */}
      </div>

      {/* Payment section with client component */}
      <div>
        <h2>Payment</h2>
        <Suspense fallback={<div>Loading payment options...</div>}>
          <CheckoutPayment />
        </Suspense>
      </div>
    </div>
  );
}
```

## Notes

- This is a demo application. In a production environment, you would:
  - Use your actual merchant ID from PayAuth dashboard
  - Implement proper payment processing with your payment provider
  - Add appropriate error handling and user feedback
  - Consider adding additional security measures

## Learn More

To learn more about Next.js, check out the [Next.js documentation](https://nextjs.org/docs).

For more information about the PayAuth SDK and passkey-based authentication, refer to the PayAuth SDK documentation.
