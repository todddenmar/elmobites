import { TAdminLink } from "@/typings";
import { CakeIcon, LayoutDashboardIcon, StoreIcon } from "lucide-react";
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
    id: "stores",
    label: "Stores",
    path: "/admin/stores",
    icon: <StoreIcon size={iconSize} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <CakeIcon size={iconSize} />,
  },
];
