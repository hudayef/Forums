import { z } from "zod";

export const CreateThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(2, "Comment must be at least 2 characters"),
  threadId: z.string(),
  parentId: z.string().optional(),
});

export const VoteSchema = z.object({
  targetId: z.string(),
  targetType: z.enum(["THREAD", "COMMENT"]),
  value: z.number().int().min(-1).max(1), // 1 for upvote, -1 for downvote, 0 to remove
});
