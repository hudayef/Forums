"use client";

import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { processCheckoutAction } from "@/actions/marketplace.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, CreditCard } from "lucide-react";

export function CheckoutForm() {
  const { items, getCartTotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push("/marketplace")}>Continue Shopping</Button>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      // Map to exact required schema format
      const checkoutItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price)
      }));

      const response = await processCheckoutAction({ items: checkoutItems });

      clearCart();

      // In a real app with Midtrans, we might redirect to Snap UI URL
      // window.location.href = response.redirectUrl;
      alert(`Checkout successful! Mock Transaction ID: ${response.orderId}`);
      router.push("/marketplace");

    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-muted-foreground">Rp {Number(item.price).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-border rounded-md p-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.productId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 h-fit sticky top-20">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">Rp {getCartTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2 mt-2">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg text-primary">Rp {getCartTotal().toLocaleString()}</span>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          <CreditCard className="h-4 w-4" />
          {isProcessing ? "Processing..." : "Pay with Midtrans"}
        </Button>
      </div>
    </div>
  );
}
