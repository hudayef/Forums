import { prisma } from "@/lib/prisma";

export class ForumRepository {
  static async getCategories() {
    return await prisma.category.findMany();
  }

  static async getThreads({
    page = 1,
    limit = 10,
    categoryId,
  }: {
    page?: number;
    limit?: number;
    categoryId?: string;
  }) {
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId, deletedAt: null } : { deletedAt: null };

    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
          tags: true,
          votes: { select: { type: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.thread.count({ where }),
    ]);

    return { threads, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getThreadById(id: string) {
    return await prisma.thread.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        tags: true,
        votes: { select: { type: true } },
        _count: { select: { comments: true } },
      },
    });
  }

  static async createThread(data: {
    title: string;
    content: string;
    categoryId: string;
    authorId: string;
    tags?: string[];
  }) {
    return await prisma.thread.create({
      data: {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        authorId: data.authorId,
        tags: data.tags
          ? {
              connectOrCreate: data.tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag, slug: tag.toLowerCase().replace(/ /g, "-") },
              })),
            }
          : undefined,
      },
    });
  }

  static async getCommentsByThreadId(threadId: string) {
    return await prisma.comment.findMany({
      where: { threadId, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, image: true } },
        votes: { select: { type: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async createComment(data: {
    content: string;
    threadId: string;
    authorId: string;
    parentId?: string;
  }) {
    return await prisma.comment.create({
      data,
    });
  }

  static async handleVote(data: {
    userId: string;
    threadId?: string;
    commentId?: string;
    value: number;
  }) {
    if (data.value === 0) {
      // Remove vote
      try {
        if (data.threadId) {
          await prisma.vote.delete({
            where: { userId_threadId: { userId: data.userId, threadId: data.threadId } },
          });
        } else if (data.commentId) {
          await prisma.vote.delete({
            where: { userId_commentId: { userId: data.userId, commentId: data.commentId } },
          });
        }
      } catch {
        // Ignore if vote doesn't exist
      }
      return { status: "removed" };
    }

    if (data.threadId) {
      return await prisma.vote.upsert({
        where: { userId_threadId: { userId: data.userId, threadId: data.threadId } },
        update: { type: data.value },
        create: {
          userId: data.userId,
          threadId: data.threadId,
          type: data.value,
        },
      });
    }

    return await prisma.vote.upsert({
      where: { userId_commentId: { userId: data.userId, commentId: data.commentId! } },
      update: { type: data.value },
      create: {
        userId: data.userId,
        threadId: data.threadId,
        commentId: data.commentId,
        type: data.value,
      },
    });
  }
}
