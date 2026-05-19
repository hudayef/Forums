"use server";

import { auth } from "@/auth";
import { ForumRepository } from "@/repositories/forum.repository";
import {
  CreateThreadSchema,
  CreateCommentSchema,
  VoteSchema,
} from "@/types/forum.types";
import { revalidatePath } from "next/cache";

export async function createThreadAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",") : undefined,
  };

  const parsed = CreateThreadSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid data provided");
  }

  const thread = await ForumRepository.createThread({
    ...parsed.data,
    authorId: session.user.id,
  });

  revalidatePath("/forum");
  return thread;
}

export async function createCommentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    content: formData.get("content") as string,
    threadId: formData.get("threadId") as string,
    parentId: formData.get("parentId") as string | undefined,
  };

  const parsed = CreateCommentSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid data provided");
  }

  const comment = await ForumRepository.createComment({
    ...parsed.data,
    authorId: session.user.id,
  });

  revalidatePath(`/forum/${parsed.data.threadId}`);
  return comment;
}

export async function voteAction(data: { targetId: string; targetType: "THREAD" | "COMMENT"; value: number }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = VoteSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid vote data");
  }

  const result = await ForumRepository.handleVote({
    userId: session.user.id,
    threadId: parsed.data.targetType === "THREAD" ? parsed.data.targetId : undefined,
    commentId: parsed.data.targetType === "COMMENT" ? parsed.data.targetId : undefined,
    value: parsed.data.value,
  });

  if (parsed.data.targetType === "THREAD") {
    revalidatePath(`/forum/${parsed.data.targetId}`);
  }
  revalidatePath("/forum");

  return result;
}
