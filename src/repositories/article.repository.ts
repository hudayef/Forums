import { prisma } from "@/lib/prisma";

export class ArticleRepository {
  static async getArticles({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;

    const where = {
      status: "PUBLISHED",
      deletedAt: null,
      OR: [
        { publishAt: null },
        { publishAt: { lte: new Date() } }
      ]
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return { articles, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getArticleBySlug(slug: string, incrementViewCount: boolean = false) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    if (article && incrementViewCount) {
      // Increment view count optimistically
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {});
    }

    return article;
  }

  static async createArticle(data: {
    title: string;
    content: string;
    status: string;
    authorId: string;
    publishAt?: Date;
  }) {
    // Generate a simple slug
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-6);

    return await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        status: data.status,
        authorId: data.authorId,
        publishAt: data.publishAt,
      },
    });
  }
}
