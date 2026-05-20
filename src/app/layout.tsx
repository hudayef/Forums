import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartWidget } from "@/features/marketplace/components/cart-widget";
import { NotificationWidget } from "@/features/notifications/components/notification-widget";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusConnect",
  description: "Next.js Enterprise Forum Platform for students",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
            {/* Global Header/Navbar placeholder */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
              <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                <div className="mr-4 hidden md:flex">
                  <Link className="mr-6 flex items-center space-x-2" href="/">
                    <span className="hidden font-bold sm:inline-block">
                      CampusConnect
                    </span>
                  </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/forum" className="transition-colors hover:text-foreground/80 text-foreground/60">Forum</Link>
                    <Link href="/articles" className="transition-colors hover:text-foreground/80 text-foreground/60">Articles</Link>
                    <Link href="/notes" className="transition-colors hover:text-foreground/80 text-foreground/60">Notes</Link>
                    <Link href="/marketplace" className="transition-colors hover:text-foreground/80 text-foreground/60">Shop</Link>
                  </nav>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <NotificationWidget userId={session?.user?.id} />
                  <CartWidget />
                </div>
              </div>
            </header>
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
