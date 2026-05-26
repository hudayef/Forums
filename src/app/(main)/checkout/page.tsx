import { CheckoutForm } from "@/features/marketplace/components/checkout-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const session = await auth();

  // Basic route protection
  if (!session?.user?.id) {
    // In a real app we might redirect to /login?callbackUrl=/checkout
    // For now we'll just require authentication conceptually
  }

  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Review your cart and proceed to mock payment via Midtrans.
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
}
