import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
});

export type CartItem = z.infer<typeof CartItemSchema>;
