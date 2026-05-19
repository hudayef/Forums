import { Suspense } from "react";
import { ForumRepository } from "@/repositories/forum.repository";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Forum | CampusConnect",
};

export const dynamic = 'force-dynamic';

// Next.js 15 requires async searchParams in pages
export default async function ForumPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const categoryId = typeof searchParams?.category === "string" ? searchParams.category : undefined;

  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Campus Forums
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Discuss, share, and connect with your fellow students.
          </p>
        </div>
        <Link
          href="/forum/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          New Thread
        </Link>
      </div>
      <hr className="my-8" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
        <div className="space-y-6">
          <Suspense fallback={<LoadingState message="Loading threads..." />}>
            <ThreadList page={page} categoryId={categoryId} />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense fallback={<div className="h-40 bg-muted animate-pulse rounded-xl" />}>
            <CategorySidebar currentCategoryId={categoryId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ThreadList({ page, categoryId }: { page: number; categoryId?: string }) {
  try {
    const { threads, total } = await ForumRepository.getThreads({ page, limit: 10, categoryId });

    if (total === 0) {
      return <EmptyState title="No threads found" description="Be the first one to start a discussion!" />;
    }

    return (
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="glass-card p-4 transition-all hover:border-primary/50">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <button className="hover:text-primary transition-colors">
                  <ArrowUp className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium">{thread._count.votes}</span>
                <button className="hover:text-destructive transition-colors">
                  <ArrowDown className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{thread.author.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                  <span>in</span>
                  <Link href={`/forum?category=${thread.category.id}`} className="hover:underline">
                    {thread.category.name}
                  </Link>
                </div>
                <Link href={`/forum/${thread.id}`} className="block">
                  <h3 className="text-xl font-semibold leading-none tracking-tight hover:underline">
                    {thread.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-2 pt-2">
                  {thread.tags.map(tag => (
                    <span key={tag.id} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
                  <Link href={`/forum/${thread.id}#comments`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread._count.comments} comments</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    return <EmptyState title="Database Error" description="Could not load threads." />;
  }
}

async function CategorySidebar({ currentCategoryId }: { currentCategoryId?: string }) {
  try {
    const categories = await ForumRepository.getCategories();

    return (
      <div className="glass-card p-4 sticky top-20">
        <h3 className="font-semibold mb-4 text-lg">Categories</h3>
        <div className="flex flex-col gap-2">
          <Link
            href="/forum"
            className={`px-3 py-2 rounded-md text-sm transition-colors ${!currentCategoryId ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            All Topics
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/forum?category=${category.id}`}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${currentCategoryId === category.id ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
