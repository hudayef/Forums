"use server";

import { auth } from "@/auth";
import { MarketplaceRepository } from "@/repositories/marketplace.repository";
import { PaymentService } from "@/services/payment.service";
import { CheckoutRequestSchema } from "@/types/marketplace.types";
import { revalidatePath } from "next/cache";

export async function processCheckoutAction(rawData: { items: { productId: string; quantity: number; price: number }[] }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to checkout.");
  }

  const parsed = CheckoutRequestSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid cart data.");
  }

  // Authoritative price check
  const validatedItems = [];
  let totalAmount = 0;

  for (const item of parsed.data.items) {
    const product = await MarketplaceRepository.getProductById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = Number(product.price);
    validatedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: price
    });
    totalAmount += price * item.quantity;
  }

  // 1. Create Order in Database
  const order = await MarketplaceRepository.createOrder({
    userId: session.user.id,
    totalAmount,
    items: validatedItems,
  });

  // 2. Mock Midtrans Payment Gateway Request
  const paymentResponse = await PaymentService.createTransaction({
    orderId: order.id,
    amount: totalAmount,
    customerDetails: {
      firstName: order.user.name || "Student",
      email: order.user.email || "student@campusconnect.local",
    },
  });

  // 3. For the sake of this mock, we will automatically assume payment succeeds
  // in a real scenario, this is handled via Midtrans Webhook.
  await MarketplaceRepository.updateOrderStatus(order.id, "PAID", paymentResponse.transactionToken);

  revalidatePath("/marketplace");

  return {
    orderId: order.id,
    redirectUrl: paymentResponse.redirectUrl,
    status: "PAID"
  };
}
