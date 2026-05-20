"use client";

import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }: { product: { id: string, name: string, price: number, stock: number } }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <Button
      size="lg"
      className="w-full md:w-auto gap-2"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
    >
      <ShoppingCart className="h-4 w-4" />
      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
