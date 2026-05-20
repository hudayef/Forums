import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class MarketplaceRepository {
  static async getProducts({ page = 1, limit = 12, search }: { page?: number; limit?: number; search?: string }) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  static async createOrder(data: {
    userId: string;
    totalAmount: number;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    // Wrap in a transaction to ensure order and items are created atomically
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          totalAmount: data.totalAmount,
          status: "PENDING",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          user: true,
        },
      });

      return order;
    });
  }

  static async updateOrderStatus(orderId: string, status: string, transactionId?: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      if (status === "PAID") {
        await tx.payment.create({
          data: {
            orderId,
            amount: order.totalAmount,
            status: "SUCCESS",
            transactionId,
          },
        });

        // Also deduct stock
        const items = await tx.orderItem.findMany({ where: { orderId } });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return order;
    });
  }
}
