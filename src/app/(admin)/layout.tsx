import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Users, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/40 bg-card hidden md:block">
          <div className="p-6">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary">
              CampusConnect
            </Link>
            <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
              Admin Portal
            </span>
          </div>
          <nav className="space-y-2 px-4 mt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary font-medium"
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Link>
            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-primary/10 hover:text-primary font-medium"
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground cursor-not-allowed">
              <Settings className="h-5 w-5" />
              Settings
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border/40 px-6 flex items-center justify-between glass sticky top-0 z-10">
            <h2 className="font-semibold">Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Admin User</span>
            </div>
          </header>
          <div className="p-6 md:p-8 max-w-7xl flex-1">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
