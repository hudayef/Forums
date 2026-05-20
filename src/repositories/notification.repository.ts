import { prisma } from "@/lib/prisma";

export class NotificationRepository {
  static async getNotificationsForUser(userId: string, limit: number = 20) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  static async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    linkUrl?: string;
  }) {
    return await prisma.notification.create({
      data,
    });
  }
}
