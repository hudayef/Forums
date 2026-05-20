"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNoteSchema } from "@/types/note.types";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNoteAction } from "@/actions/note.actions";
import { StorageService } from "@/services/storage.service";
import { UploadCloud } from "lucide-react";

export function UploadNoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateNoteSchema>>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: "",
      description: "",
      courseName: "",
      fileUrl: "https://pending-upload.local", // Temporary placeholder to pass initial zod config before upload
    },
  });

  async function onSubmit(values: z.infer<typeof CreateNoteSchema>) {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Upload to storage (mock)
      const uploadedFileUrl = await StorageService.uploadFile(file, "notes");

      // 2. Save metadata to database
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      if (values.courseName) formData.append("courseName", values.courseName);
      formData.append("fileUrl", uploadedFileUrl);

      const newNote = await createNoteAction(formData);
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload note.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
              Select PDF Document
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Label>
          {file && (
            <p className="mt-4 text-sm font-medium text-foreground">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Data Structures Midterm Review" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="CS 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are these notes about?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading || !file}>
            {isLoading ? "Uploading..." : "Upload Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Inline Label primitive locally since we didn't export it globally exactly like this
function Label({ className, htmlFor, children }: { className?: string; htmlFor?: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className={className}>{children}</label>;
}
