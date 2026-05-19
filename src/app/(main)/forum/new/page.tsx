import { ForumRepository } from "@/repositories/forum.repository";
import { CreateThreadForm } from "@/features/forum/components/create-thread-form";

export const metadata = {
  title: "New Thread | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function NewThreadPage() {
  let categories: { id: string, name: string }[] = [];
  try {
    categories = await ForumRepository.getCategories();
  } catch (e) {
    console.warn("Could not fetch categories at build time");
  }

  return (
    <div className="container max-w-3xl py-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Thread</h1>
        <p className="text-muted-foreground mt-2">
          Start a discussion with your peers.
        </p>
      </div>

      <div className="glass-card p-6">
        <CreateThreadForm categories={categories} />
      </div>
    </div>
  );
}
