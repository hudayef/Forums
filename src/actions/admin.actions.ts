"use server";

import { auth } from "@/auth";
import { AdminRepository } from "@/repositories/admin.repository";

import { prisma } from "@/lib/prisma";

// Helper to verify admin access securely (RBAC)
async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  // Authoritative Role Verification
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true }
  });

  if (!user || !user.role) {
    throw new Error("Forbidden: Invalid user profile.");
  }

  const roleName = user.role.name.toLowerCase();
  if (roleName !== "admin" && roleName !== "super_admin") {
    throw new Error("Forbidden: Admin access strictly required.");
  }

  return user;
}

export async function getDashboardStatsAction() {
  await requireAdmin();
  return await AdminRepository.getPlatformStats();
}

export async function getRecentUsersAction() {
  await requireAdmin();
  return await AdminRepository.getRecentUsers();
}
