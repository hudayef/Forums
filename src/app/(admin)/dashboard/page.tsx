import { getDashboardStatsAction } from "@/actions/admin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, ShoppingCart, DollarSign } from "lucide-react";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";

export const metadata = {
  title: "Admin Dashboard | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your platform&apos;s growth and activity.
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading platform statistics..." />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}

async function DashboardStats() {
  try {
    const stats = await getDashboardStatsAction();

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalThreads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% new discussions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% successful checkouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% revenue growth</p>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 border border-destructive/50 rounded-xl bg-destructive/10 text-destructive">
        <h3 className="font-semibold">Access Denied</h3>
        <p className="text-sm mt-1">You do not have permission to view these statistics, or there was a server error.</p>
      </div>
    );
  }
}
