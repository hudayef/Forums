import { Suspense } from "react";
import { ArticleRepository } from "@/repositories/article.repository";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Articles | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;

  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Campus Articles
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Educational content, guides, and student achievements.
          </p>
        </div>
        <Link
          href="/articles/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Write Article
        </Link>
      </div>
      <hr className="my-8" />
      <div className="space-y-6">
        <Suspense fallback={<LoadingState message="Loading articles..." />}>
          <ArticleList page={page} />
        </Suspense>
      </div>
    </div>
  );
}

async function ArticleList({ page }: { page: number }) {
  try {
    const { articles, total } = await ArticleRepository.getArticles({ page, limit: 12 });

    if (total === 0) {
      return <EmptyState title="No articles found" description="Be the first to publish an article!" />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="block">
            <div className="glass-card h-full p-6 transition-all hover:border-primary/50 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold leading-tight tracking-tighter mb-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  {/* Simplistic markdown stripping for preview */}
                  {article.content.replace(/[#_*\[\]]/g, '')}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/50">
                <span className="font-medium text-foreground">{article.author?.name || "Unknown"}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(article.publishAt || article.createdAt), { addSuffix: true })}</span>
                <span>•</span>
                <span>{article.viewCount} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (e) {
    return <EmptyState title="Database Error" description="Could not load articles." />;
  }
}
