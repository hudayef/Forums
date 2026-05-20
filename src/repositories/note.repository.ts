import { prisma } from "@/lib/prisma";

export class NoteRepository {
  static async getNotes({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string }) {
    const skip = (page - 1) * limit;

    const where: import("@prisma/client").Prisma.NoteWhereInput = { deletedAt: null };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { courseName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.note.count({ where }),
    ]);

    return { notes, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getNoteById(id: string) {
    return await prisma.note.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });
  }

  static async createNote(data: {
    title: string;
    description?: string;
    courseName?: string;
    fileUrl: string;
    authorId: string;
  }) {
    return await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
        courseName: data.courseName,
        fileUrl: data.fileUrl,
        authorId: data.authorId,
      },
    });
  }
}
