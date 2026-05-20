"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartWidget() {
  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Link href="/checkout">
      <Button variant="outline" size="icon" className="relative group">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in group-hover:scale-110 transition-transform">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
