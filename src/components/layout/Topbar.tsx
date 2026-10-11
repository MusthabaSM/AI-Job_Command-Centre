"use client";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar"; // Will inject mobile version logic soon
import { useNotifications } from "@/lib/firebase/queries";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Topbar() {
  const handleLogout = () => {
    document.cookie = 'demo_mode=false; path=/';
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const { data: notifications = [] } = useNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:h-[60px] md:justify-end">
      
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger render={<Button size="icon" aria-label="Open menu" variant="outline" className="sm:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <Sidebar className="flex flex-col" />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs would go here, omitting for brevity to focus on right actions */}
      <div className="flex-1 md:hidden" />

      {/* Global Search / Command Palette Hint */}
      <Button variant="outline" className="hidden md:flex w-64 justify-between text-muted-foreground" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'metaKey': true}))}>
        <span className="flex items-center">
          <Search className="mr-2 h-4 w-4" /> Search...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Notifications" className="relative" />}>
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600"></span>}
            <span className="sr-only">Notifications</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              ) : (
                notifications.map((n: any) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start p-3 gap-1 cursor-pointer">
                    <span className="font-medium text-sm">{n.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="User menu" className="rounded-full" />}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
