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
    title: formData.get("title")?.toString() || "",
    content: formData.get("content")?.toString() || "",
    categoryId: formData.get("categoryId")?.toString() || "",
    tags: formData.get("tags") ? formData.get("tags")?.toString().split(",") : undefined,
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
    content: formData.get("content")?.toString() || "",
    threadId: formData.get("threadId")?.toString() || "",
    parentId: formData.get("parentId")?.toString() || undefined,
  };

  const parsed = CreateCommentSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Invalid data provided");
  }

  const comment = await ForumRepository.createComment({
    ...parsed.data,
    authorId: session.user.id,
  });

  // Fetch the thread to know who to notify
  const thread = await ForumRepository.getThreadById(parsed.data.threadId);

  if (thread && thread.authorId !== session.user.id) {
    const { NotificationRepository } = await import("@/repositories/notification.repository");
    const { RealtimeService } = await import("@/services/realtime.service");

    // 1. Persist notification to DB
    const notification = await NotificationRepository.createNotification({
      userId: thread.authorId,
      type: "REPLY",
      title: "New Comment on your Thread",
      message: `${session.user.name || "Someone"} commented: "${parsed.data.content.substring(0, 50)}..."`,
      linkUrl: `/forum/${thread.id}#comments`,
    });

    // 2. Broadcast event
    RealtimeService.broadcastNotification(thread.authorId, notification);
  }

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
