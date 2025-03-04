"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import "./style.scss";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/store";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TuneIcon from "@mui/icons-material/Tune";
import Diversity3Icon from "@mui/icons-material/Diversity3";

function AppSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const storeUser = useAuthStore((state) => state.logout);

  return (
    <Sidebar className="cus-style-sidebar">
      <SidebarHeader className="p-10">
        <Image src={"/logo.png"} width={70} height={70} alt="HCC" />
      </SidebarHeader>
      <SidebarContent className="pt-2 pb-2 pl-10 pr-10">
        <Link
          href={"/"}
          className={
            pathname == "/" ? "active-link pt-2 pb-2" : "text-white pt-2 pb-2"
          }
        >
          <DashboardIcon /> Dashboard
        </Link>
        <Link
          href={"/employees"}
          className={
            pathname == "/employees"
              ? "active-link pt-2 pb-2"
              : "text-white pt-2 pb-2"
          }
        >
          <PeopleOutlineIcon /> Employees
        </Link>
        <Link
          href={"/clients"}
          className={
            pathname == "/clients"
              ? "active-link pt-2 pb-2"
              : "text-white pt-2 pb-2"
          }
        >
          <Diversity3Icon /> Clients
        </Link>
        <Link
          href={"/settings"}
          className={
            pathname == "/settings"
              ? "active-link pt-2 pb-2"
              : "text-white pt-2 pb-2"
          }
        >
          <TuneIcon /> Settings
        </Link>
      </SidebarContent>
      <SidebarFooter className="pl-10 pb-10">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/login");
                storeUser();
              }}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;
