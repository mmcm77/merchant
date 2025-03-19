"use client";

import { useEffect, useRef, useState } from "react";

// Define SDK types
export interface AuthResult {
  userId: string;
  email: string;
  passkeyCount: number;
  token: string;
  expiresAt: number;
}

interface PayAuthSDK {
  mount: (element?: HTMLElement | string) => void;
  unmount: () => void;
  authenticate: () => Promise<AuthResult>;
  isAuthenticated: () => boolean;
  destroy: () => void;
}

// Add global type declaration
declare global {
  interface Window {
    PayAuth?: {
      init: (options: PayAuthOptions) => PayAuthSDK;
    };
  }
}

// PayAuth SDK initialization options
interface PayAuthOptions {
  merchantId: string;
  apiToken?: string;
  serviceUrl: string;
  theme?: "light" | "dark";
  buttonText?: string;
  container?: HTMLElement | string;
  origin?: string;
  allowedOrigins?: string[];
  callbacks: {
    onSuccess: (result: AuthResult) => void;
    onError: (error: Error) => void;
    onCancel?: () => void;
  };
}

// Component props
interface PayAuthButtonProps {
  merchantId: string;
  apiToken?: string;
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  theme?: "light" | "dark";
  buttonText?: string;
}

export default function PayAuthButton({
  merchantId,
  apiToken = "payauth_test_tk_3f7c9a1b5d8e2f4a6c0b9d8e2f4a6c0b9d8e2f4a", // Default to the test token
  onSuccess,
  onError,
  onCancel,
  theme = "light",
  buttonText = "Pay with Passkey",
}: PayAuthButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<PayAuthSDK | null>(null);

  // Load SDK script
  useEffect(() => {
    // Add window message event listener for debugging
    const messageHandler = (event: MessageEvent) => {
      if (event.origin.includes("passkeys-one.vercel.app")) {
        console.log("Received message from PayAuth:", event.data);
      }
    };

    window.addEventListener("message", messageHandler);

    // Avoid duplicate loading
    if (document.querySelector('script[src*="payauth.min.js"]')) {
      setIsLoaded(true);
      return () => {
        window.removeEventListener("message", messageHandler);
      };
    }

    const script = document.createElement("script");
    script.src = "https://passkeys-one.vercel.app/sdk/payauth.min.js";
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("Failed to load PayAuth SDK");
    };

    document.body.appendChild(script);

    return () => {
      // Clean up SDK on unmount if we added the script
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  // Initialize SDK when loaded
  useEffect(() => {
    if (isLoaded && containerRef.current && window.PayAuth) {
      try {
        console.log(
          "Initializing PayAuth SDK with token:",
          apiToken ? "Token provided" : "No token"
        );

        // Following the exact documentation example
        sdkRef.current = window.PayAuth.init({
          merchantId: merchantId,
          apiToken: apiToken, // Make sure this is passed correctly
          serviceUrl: "https://passkeys-one.vercel.app",
          theme: theme,
          buttonText: buttonText,
          // Explicitly set the allowed origins
          allowedOrigins: [
            "https://merchant-steel.vercel.app",
            "http://localhost:3000",
          ],
          callbacks: {
            onSuccess: (result: AuthResult) => {
              console.log("SDK Success callback with result:", result);
              if (onSuccess) onSuccess(result);
            },
            onError: (error: Error) => {
              console.log("SDK Error callback:", error);
              if (onError) onError(error);
            },
            onCancel: () => {
              console.log("SDK Cancel callback");
              if (onCancel) onCancel();
            },
          },
        });

        sdkRef.current.mount(containerRef.current);
      } catch (err) {
        console.error("SDK initialization error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    return () => {
      // Clean up when props change or component unmounts
      if (sdkRef.current) {
        sdkRef.current.unmount();
      }
    };
  }, [
    isLoaded,
    merchantId,
    apiToken,
    theme,
    buttonText,
    onSuccess,
    onError,
    onCancel,
  ]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="passkey-auth-container"
      aria-live="polite"
    >
      {!isLoaded && (
        <div className="text-gray-500">Loading payment options...</div>
      )}
    </div>
  );
}
