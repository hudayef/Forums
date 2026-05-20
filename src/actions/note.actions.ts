"use server";

import { auth } from "@/auth";
import { NoteRepository } from "@/repositories/note.repository";
import { CreateNoteSchema } from "@/types/note.types";
import { revalidatePath } from "next/cache";

export async function createNoteAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title")?.toString() || "",
    description: formData.get("description")?.toString() || undefined,
    courseName: formData.get("courseName")?.toString() || undefined,
    fileUrl: formData.get("fileUrl")?.toString() || "",
  };

  const parsed = CreateNoteSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid note data provided");
  }

  const note = await NoteRepository.createNote({
    ...parsed.data,
    authorId: session.user.id,
  });

  revalidatePath("/notes");
  return note;
}
