# PasskeySDK Demo

This is a Next.js demo application that showcases the integration of the PasskeySDK for passkey-based authentication and payments.

## Overview

This demo app demonstrates how to integrate the PasskeySDK into a Next.js application to enable passkey-based authentication for payments. The application includes:

- A client-side PayAuthButton component that loads and initializes the PasskeySDK
- Multiple implementation options:
  - Standard button - SDK manages the button rendering
  - Custom button - Attach the SDK's authenticate method to your own button
- Example checkout pages showing different integration approaches
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

## SDK Integration Methods

The PayAuthButton component supports two main integration methods:

### 1. Standard Button (SDK manages the UI)

```tsx
<PayAuthButton
  merchantId="YOUR_MERCHANT_ID"
  onSuccess={(result) => {
    // Handle successful authentication
  }}
  onError={(error) => {
    // Handle authentication errors
  }}
  onCancel={() => {
    // Handle user cancellation
  }}
  theme="light"
  buttonStyle="default"
  buttonText="Pay with Passkey"
/>
```

### 2. Custom Button (You control the UI)

```tsx
<button id="custom-passkey-button">Your Custom Button</button>

<PayAuthButton
  merchantId="YOUR_MERCHANT_ID"
  onSuccess={handleSuccess}
  onError={handleError}
  onCancel={handleCancel}
  useCustomButton={true}
  customButtonId="custom-passkey-button"
/>
```

## Checkout Flow Examples

The demo includes two checkout page examples:

1. `/checkout` - Uses a server component with a client component wrapper for the PasskeySDK button
2. `/checkout-alt` - A fully client component implementation showing both standard and custom button options

## Notes

- This is a demo application. In a production environment, you would:
  - Use your actual merchant ID from PasskeySDK provider
  - Implement proper payment processing with your payment provider
  - Add appropriate error handling and user feedback
  - Consider adding additional security measures

## Learn More

To learn more about Next.js, check out the [Next.js documentation](https://nextjs.org/docs).

For more information about the PasskeySDK and passkey-based authentication, refer to the PasskeySDK documentation.
