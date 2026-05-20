import { getRecentUsersAction } from "@/actions/admin.actions";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "User Management | CampusConnect",
};

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage registered platform users.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <Suspense fallback={<LoadingState message="Loading users..." />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
}

async function UsersTable() {
  try {
    const users = await getRecentUsersAction();

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || "Anonymous"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {user.role?.name || "Member"}
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  } catch (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>Failed to load users. Ensure you have admin privileges.</p>
      </div>
    );
  }
}
