import { MarketplaceRepository } from "@/repositories/marketplace.repository";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { PackageOpen } from "lucide-react";
import { AddToCartButton } from "@/features/marketplace/components/add-to-cart-button";
import Image from "next/image";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const product = await MarketplaceRepository.getProductById(params.id);
    if (!product) return { title: "Product Not Found" };
    return { title: `${product.name} | CampusConnect Marketplace` };
  } catch {
    return { title: "Product Error" };
  }
}

export const dynamic = 'force-dynamic';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const product = await MarketplaceRepository.getProductById(params.id);

    if (!product) {
      notFound();
    }

    return (
      <div className="container max-w-5xl py-6 lg:py-10">
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">

            {/* Image Placeholder */}
            <div className="bg-muted rounded-xl flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden">
               {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <PackageOpen className="h-24 w-24 text-muted-foreground" />
                )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tighter">
                  {product.name}
                </h1>
                <div className="mt-4 flex items-center gap-4 border-b border-border/50 pb-6">
                  <span className="text-3xl font-bold text-primary">
                    Rp {Number(product.price).toLocaleString()}
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    stock: product.stock
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
