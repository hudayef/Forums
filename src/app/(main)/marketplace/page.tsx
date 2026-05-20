import { Suspense } from "react";
import { MarketplaceRepository } from "@/repositories/marketplace.repository";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageOpen, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Marketplace | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function MarketplacePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams?.q === "string" ? searchParams.q : undefined;

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Student Marketplace
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Buy and sell books, electronics, and campus essentials.
          </p>
        </div>
      </div>

      <div className="my-8">
        <form className="flex w-full max-w-md items-center space-x-2">
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search products..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<LoadingState message="Loading products..." />}>
          <ProductList page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductList({ page, search }: { page: number; search?: string }) {
  try {
    const { products, total } = await MarketplaceRepository.getProducts({ page, limit: 12, search });

    if (total === 0) {
      return <EmptyState title="No products found" description="Try adjusting your search filters." />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/marketplace/${product.id}`} className="block group">
            <div className="glass-card h-full overflow-hidden transition-all hover:border-primary/50 flex flex-col">
              <div className="bg-muted flex items-center justify-center h-48 w-full group-hover:bg-muted/80 transition-colors">
                {product.images?.[0] ? (
                  // Assuming images logic
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <PackageOpen className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold leading-tight group-hover:underline line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">
                    Rp {Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (e) {
    return <EmptyState title="Database Error" description="Could not load products." />;
  }
}
