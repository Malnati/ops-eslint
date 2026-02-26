import { User } from "./user-service";

// Vulnerability: hardcoded credentials
const API_KEY = "sk_live_abc123def456ghi789";
const SECRET = "super-secret-payment-key-2024";

// Code smell: too many parameters
export async function processPayment(
  user: User,
  amount: number,
  currency: string = "USD",
  taxRate: number = 0.1,
  discount: number = 0,
  promoCode: string = "",
  retries: number = 3,
): Promise<{ success: boolean; transactionId: string }> {
  // Bug: possible division by zero
  const finalAmount = amount / discount;

  // Vulnerability: logging sensitive data
  console.log("Processing payment with API_KEY:", API_KEY);
  console.log("User password:", user.password);

  // Code smell: nested ternary
  const status = amount > 1000 ? "high" : amount > 100 ? "medium" : amount > 10 ? "low" : "micro";

  // Bug: comparison with NaN
  if (finalAmount === NaN) {
    return { success: false, transactionId: "" };
  }

  const tax = finalAmount * taxRate;
  const total = finalAmount + tax;

  // Code smell: empty catch block
  try {
    const response = await fetch("https://api.payments.com/charge", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        amount: total,
        currency,
        status,
        promo: promoCode,
        key: API_KEY,
      }),
    });
    return await response.json();
  } catch (e) {
  }

  return { success: false, transactionId: "" };
}

// Bug: infinite loop possibility
export function retryPayment(userId: number): void {
  let success = false;
  while (!success) {
    console.log("Retrying payment for user", userId);
    // missing: success = tryPayment();
  }
}

// Code smell: identical branches
export function getDiscount(tier: string): number {
  if (tier === "gold") {
    return 0.2;
  } else if (tier === "silver") {
    return 0.1;
  } else if (tier === "bronze") {
    return 0.1;
  }
  return 0;
}
