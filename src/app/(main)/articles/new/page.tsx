import { CreateArticleForm } from "@/features/articles/components/create-article-form";

export const metadata = {
  title: "New Article | CampusConnect",
};

export default function NewArticlePage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Write an Article</h1>
        <p className="text-muted-foreground mt-2">
          Share your knowledge with the campus community using Markdown.
        </p>
      </div>

      <div className="glass-card p-6">
        <CreateArticleForm />
      </div>
    </div>
  );
}
