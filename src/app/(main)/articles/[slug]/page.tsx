import { ArticleRepository } from "@/repositories/article.repository";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const article = await ArticleRepository.getArticleBySlug(params.slug, false);
    if (!article) return { title: "Article Not Found" };
    return { title: `${article.title} | CampusConnect` };
  } catch {
    return { title: "Article Error" };
  }
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  try {
    const article = await ArticleRepository.getArticleBySlug(params.slug, true);

    if (!article) {
      notFound();
    }

    return (
      <div className="container max-w-3xl py-6 lg:py-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tighter">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border/50 pb-6">
            <span className="font-medium text-foreground">{article.author?.name || "Unknown Author"}</span>
            <span>•</span>
            <span>Published {formatDistanceToNow(new Date(article.publishAt || article.createdAt), { addSuffix: true })}</span>
            <span>•</span>
            <span>{article.viewCount} views</span>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
