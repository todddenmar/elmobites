import { TAdminLink } from "@/typings";
import {
  CakeIcon,
  ClipboardListIcon,
  CogIcon,
  FileBoxIcon,
  LayoutDashboardIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
const iconSize = 18;

export const adminLinks: TAdminLink[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboardIcon size={iconSize} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ClipboardListIcon size={iconSize} />,
  },

  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <CakeIcon size={iconSize} />,
  },
  {
    id: "inventory",
    label: "Inventory",
    path: "/admin/inventory",
    icon: <FileBoxIcon size={iconSize} />,
  },
  {
    id: "stores",
    label: "Stores",
    path: "/admin/stores",
    icon: <StoreIcon size={iconSize} />,
  },
  {
    id: "employees",
    label: "Employees",
    path: "/admin/employees",
    icon: <UsersIcon size={iconSize} />,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: <CogIcon size={iconSize} />,
  },
];
