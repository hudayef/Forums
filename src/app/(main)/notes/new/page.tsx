import { UploadNoteForm } from "@/features/notes/components/upload-note-form";

export const metadata = {
  title: "Upload Note | CampusConnect",
};

export default function NewNotePage() {
  return (
    <div className="container max-w-2xl py-6 lg:py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Notes</h1>
        <p className="text-muted-foreground mt-2">
          Share your study materials and help fellow students succeed.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <UploadNoteForm />
      </div>
    </div>
  );
}
