"use client";

import {
  Check,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { SignOutButton } from "@clerk/nextjs";

const NavUser = () => {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { userDetails, isLoading, isSignedIn, isLoaded } = useAuth();

  if (isLoading || !isLoaded || !userDetails || !isSignedIn) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userDetails.image || "/userAvatarFallback.jpg"}
                  alt={userDetails.name || "user's Avatar"}
                />
                <AvatarFallback className="rounded-lg">Me</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userDetails.name || "user's name"}
                </span>
                <span className="truncate text-xs">{userDetails.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userDetails.image || "/userAvatarFallback.jpg"}
                    alt={userDetails.name || "user's Avatar"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userDetails.name || "user's name"}
                  </span>
                  <span className="truncate text-xs">{userDetails.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Account Settings
              </DropdownMenuItem>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem className="justify-between">
                    <Sparkles className="mr-2 size-4" />
                    Theme
                    <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="min-w-32 rounded-lg"
                >
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 size-4" />
                    System Default
                    {theme == "system" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 size-4" />
                    Light
                    {theme == "light" && <Check className="ms-2 size-4 " />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 size-4" />
                    Dark
                    {theme == "dark" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignOutButton>
                <div className="flex items-center gap-2">
                  <LogOut />
                  Log out
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
