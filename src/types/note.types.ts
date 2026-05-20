import { z } from "zod";

export const CreateNoteSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().optional(),
  courseName: z.string().optional(),
  fileUrl: z.string().url("Must be a valid file URL"),
});
