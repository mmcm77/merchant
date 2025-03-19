import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, orderId, amount } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token is required" },
        { status: 400 }
      );
    }

    // 1. Verify the authentication token with PayAuth service
    try {
      const verifyResponse = await fetch(
        "https://passkeys-one.vercel.app/api/verify-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      // Check if the verification call was successful
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.error("Token verification failed:", errorData);
        return NextResponse.json(
          { success: false, error: "Token verification failed" },
          { status: 401 }
        );
      }

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.valid) {
        return NextResponse.json(
          { success: false, error: "Invalid authentication token" },
          { status: 401 }
        );
      }

      console.log(
        "Token verified successfully for user:",
        verifyResult.userId || email
      );
    } catch (verifyError) {
      console.error("Error verifying token:", verifyError);
      return NextResponse.json(
        { success: false, error: "Error verifying authentication token" },
        { status: 500 }
      );
    }

    console.log("Processing payment for:", email);
    console.log("Order ID:", orderId);
    console.log("Amount:", amount);

    // 2. Process the payment with your payment provider
    // For this demo, we'll just return success, but in a real application
    // you would integrate with your payment processor here

    // 3. Return the result
    return NextResponse.json({
      success: true,
      orderId: orderId || `ORDER-${Math.floor(Math.random() * 10000)}`,
      paymentDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { success: false, error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
