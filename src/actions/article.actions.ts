"use server";

import { auth } from "@/auth";
import { ArticleRepository } from "@/repositories/article.repository";
import { CreateArticleSchema } from "@/types/article.types";
import { revalidatePath } from "next/cache";

export async function createArticleAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title")?.toString() || "",
    content: formData.get("content")?.toString() || "",
    status: formData.get("status")?.toString() || "DRAFT",
    publishAt: formData.get("publishAt")?.toString() || undefined,
  };

  const parsed = CreateArticleSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid article data provided");
  }

  const article = await ArticleRepository.createArticle({
    title: parsed.data.title,
    content: parsed.data.content,
    status: parsed.data.status,
    publishAt: parsed.data.publishAt ? new Date(parsed.data.publishAt) : undefined,
    authorId: session.user.id,
  });

  revalidatePath("/articles");
  return article;
}
