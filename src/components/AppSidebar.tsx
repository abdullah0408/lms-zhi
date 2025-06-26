import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import NavUser from "./NavUser";
import { NavCourses } from "./NavCourses";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="flex items-center justify-center hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
              asChild
            >
              <Link
                href="/dashboard"
                className="block max-h-12 overflow-hidden hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
              >
                <Image
                  src="/logo.jpg"
                  alt="Zhi Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCourses />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
