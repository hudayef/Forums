import { NoteRepository } from "@/repositories/note.repository";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { FileText, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const note = await NoteRepository.getNoteById(params.id);
    if (!note) return { title: "Note Not Found" };
    return { title: `${note.title} | CampusConnect` };
  } catch {
    return { title: "Note Error" };
  }
}

export const dynamic = 'force-dynamic';

export default async function NotePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const note = await NoteRepository.getNoteById(params.id);

    if (!note) {
      notFound();
    }

    return (
      <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
        <div className="glass-card p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Left side: Icon & Actions */}
            <div className="flex flex-col items-center gap-6 w-full md:w-48 shrink-0">
              <div className="rounded-2xl bg-primary/10 p-8 w-full flex items-center justify-center">
                <FileText className="h-20 w-20 text-primary" />
              </div>
              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full gap-2" size="lg">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </a>
              <div className="flex items-center gap-2 text-lg font-bold text-amber-500">
                <Star className="h-6 w-6 fill-current" />
                <span>{note.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* Right side: Details */}
            <div className="flex-1 space-y-6">
              <div>
                {note.courseName && (
                  <span className="inline-block rounded-md bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground mb-4">
                    {note.courseName}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tighter">
                  {note.title}
                </h1>

                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Uploaded by {note.author?.name || "Unknown"}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {note.description && (
                <div className="prose prose-neutral dark:prose-invert max-w-none border-t border-border/50 pt-6">
                  <h3>Description</h3>
                  <p>{note.description}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
