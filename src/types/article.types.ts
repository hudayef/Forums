import { z } from "zod";

export const CreateArticleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  content: z.string().min(20, "Content must be at least 20 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishAt: z.string().optional(),
});
