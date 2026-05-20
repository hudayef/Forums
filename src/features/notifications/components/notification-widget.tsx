"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/services/realtime.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: string;
  title: string;
  message: string;
  linkUrl: string | null;
  isRead: boolean;
};

export function NotificationWidget({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial mock payload or let it stay empty until a real broadcast
    // We would normally fetch initial from Server Actions or React Query.

    if (!supabaseClient) return;

    // Subscribe to broadcasts targeting this user
    const channel = supabaseClient
      .channel(`user-${userId}`)
      .on("broadcast", { event: "new-notification" }, (payload) => {
        const newNotif = payload.payload as Notification;
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((c) => c + 1);

        // Optional: Trigger a browser toast/alert here
      })
      .subscribe();

    return () => {
      supabaseClient?.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // Real app: call Server Action to update database status
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative inline-block cursor-pointer">
          <Button variant="outline" size="icon" className="relative group" type="button">
            <Bell className="h-5 w-5" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in pointer-events-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs px-2" onClick={markAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground p-4 text-center">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">You have no new notifications.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.linkUrl || "#"}
                  className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notif.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.isRead && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
