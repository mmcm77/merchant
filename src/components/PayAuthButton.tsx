"use client";

import { useEffect, useRef, useState } from "react";

// Define types for the SDK based on documentation
interface AuthResult {
  userId: string;
  email: string;
  passkeyCount: number;
  token: string;
  expiresAt: number;
}

interface PasskeySDK {
  mount: (element?: HTMLElement | string) => void;
  unmount: () => void;
  authenticate: () => Promise<AuthResult>;
  isAuthenticated: () => boolean;
  destroy: () => void;
}

declare global {
  interface Window {
    PasskeySDK?: {
      init: (options: any) => PasskeySDK;
    };
  }
}

interface PayAuthButtonProps {
  merchantId: string;
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  theme?: "light" | "dark";
  buttonText?: string;
  buttonStyle?: "default" | "minimal" | "branded";
  useCustomButton?: boolean;
  customButtonId?: string;
}

export default function PayAuthButton({
  merchantId,
  onSuccess,
  onError,
  onCancel,
  theme = "light",
  buttonText = "Pay with Passkey",
  buttonStyle = "default",
  useCustomButton = false,
  customButtonId,
}: PayAuthButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<PasskeySDK | null>(null);

  useEffect(() => {
    // Load the SDK script
    const script = document.createElement("script");
    script.src = "https://passkeys-one.vercel.app/sdk/payauth.min.js"; // Using our test URL for now
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("Failed to load Passkey SDK");
    };

    document.body.appendChild(script);

    return () => {
      // Clean up script and SDK on unmount
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  // Initialize SDK when loaded
  useEffect(() => {
    if (isLoaded && window.PasskeySDK) {
      try {
        const options = {
          merchantId,
          serviceUrl: "https://passkeys-one.vercel.app", // Using our test URL
          theme,
          buttonText,
          buttonStyle,
          callbacks: {
            onSuccess: (result: AuthResult) => {
              console.log("Authentication successful:", result);
              if (onSuccess) onSuccess(result);
            },
            onError: (error: Error) => {
              console.error("Authentication error:", error);
              if (onError) onError(error);
            },
            onCancel: () => {
              console.log("Authentication cancelled by user");
              if (onCancel) onCancel();
            },
          },
        };

        // If using auto-mount, add container to options
        if (!useCustomButton && containerRef.current) {
          sdkRef.current = window.PasskeySDK.init({
            ...options,
            container: containerRef.current,
          });
        } else {
          // Otherwise initialize without container
          sdkRef.current = window.PasskeySDK.init(options);

          // For custom button, attach the authenticate method
          if (useCustomButton && customButtonId) {
            setTimeout(() => {
              const customButton = document.getElementById(customButtonId);
              if (customButton && sdkRef.current) {
                customButton.addEventListener("click", () => {
                  sdkRef.current
                    ?.authenticate()
                    .then((result: AuthResult) => {
                      if (onSuccess) onSuccess(result);
                    })
                    .catch((error: Error) => {
                      if (onError) onError(error);
                    });
                });
              }
            }, 0);
          } else if (!useCustomButton && containerRef.current) {
            // Manual mount to our container
            sdkRef.current.mount(containerRef.current);
          }
        }
      } catch (err) {
        console.error("SDK initialization error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
  }, [
    isLoaded,
    merchantId,
    theme,
    buttonText,
    buttonStyle,
    onSuccess,
    onError,
    onCancel,
    useCustomButton,
    customButtonId,
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
