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
  serviceUrl: string;
  theme?: "light" | "dark";
  buttonText?: string;
  container?: HTMLElement | string;
  callbacks: {
    onSuccess: (result: AuthResult) => void;
    onError: (error: Error) => void;
    onCancel?: () => void;
  };
}

// Component props
interface PayAuthButtonProps {
  merchantId: string;
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  theme?: "light" | "dark";
  buttonText?: string;
}

export default function PayAuthButton({
  merchantId,
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
    // Avoid duplicate loading
    if (document.querySelector('script[src*="payauth.min.js"]')) {
      setIsLoaded(true);
      return;
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
    };
  }, []);

  // Initialize SDK when loaded
  useEffect(() => {
    if (isLoaded && containerRef.current && window.PayAuth) {
      try {
        sdkRef.current = window.PayAuth.init({
          merchantId,
          serviceUrl: "https://passkeys-one.vercel.app",
          theme,
          buttonText,
          callbacks: {
            onSuccess: (result: AuthResult) => {
              if (onSuccess) onSuccess(result);
            },
            onError: (error: Error) => {
              if (onError) onError(error);
            },
            onCancel: () => {
              if (onCancel) onCancel();
            },
          },
        });

        sdkRef.current.mount(containerRef.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    return () => {
      // Clean up when props change or component unmounts
      if (sdkRef.current) {
        sdkRef.current.unmount();
      }
    };
  }, [isLoaded, merchantId, theme, buttonText, onSuccess, onError, onCancel]);

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
