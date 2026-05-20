import { Suspense } from "react";
import { NoteRepository } from "@/repositories/note.repository";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Notes | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function NotesPage(props: {
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
            Study Materials
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse, download, and share class notes and study guides.
          </p>
        </div>
        <Link href="/notes/new">
          <Button>Upload Notes</Button>
        </Link>
      </div>

      {/* Search Bar Placeholder */}
      <div className="my-8">
        <form className="flex w-full max-w-md items-center space-x-2">
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search by title or course name..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<LoadingState message="Loading notes..." />}>
          <NotesList page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}

async function NotesList({ page, search }: { page: number; search?: string }) {
  try {
    const { notes, total } = await NoteRepository.getNotes({ page, limit: 12, search });

    if (total === 0) {
      return <EmptyState title="No notes found" description="Try a different search or upload a new note." />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Link key={note.id} href={`/notes/${note.id}`} className="block group">
            <div className="glass-card h-full p-5 transition-all hover:border-primary/50 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{note.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {note.courseName && (
                  <span className="inline-block rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                    {note.courseName}
                  </span>
                )}
                <h3 className="text-xl font-bold leading-tight group-hover:underline">
                  {note.title}
                </h3>
                {note.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {note.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{note.author?.name || "Unknown"}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(note.createdAt))} ago</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (e) {
    return <EmptyState title="Database Error" description="Could not load notes." />;
  }
}
