import { prisma } from "@/lib/prisma";

export class AdminRepository {
  static async getPlatformStats() {
    const [
      totalUsers,
      totalThreads,
      totalOrders,
      totalRevenueRaw
    ] = await Promise.all([
      prisma.user.count(),
      prisma.thread.count({ where: { deletedAt: null } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true }
      })
    ]);

    return {
      totalUsers,
      totalThreads,
      totalOrders,
      totalRevenue: Number(totalRevenueRaw._sum.totalAmount || 0),
    };
  }

  static async getRecentUsers(limit: number = 10) {
    return await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: { select: { name: true } }
      }
    });
  }
}
