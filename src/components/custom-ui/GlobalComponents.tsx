import { TAdminLink, TOrderStatus, TOrderTableItem } from "@/typings";
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
import { Badge } from "../ui/badge";
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

export const OrderStatusBadge = (status: TOrderStatus) => {
  const statusConfig: Record<
    TOrderTableItem["status"],
    { label: string; className: string }
  > = {
    PENDING: {
      label: "Pending",
      className: "bg-gray-500 text-white",
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-blue-500 text-white",
    },
    PREPARING: {
      label: "Preparing",
      className: "bg-yellow-500 text-white",
    },
    READY_FOR_PICKUP: {
      label: "Ready for Pickup",
      className: "bg-indigo-500 text-white",
    },
    OUT_FOR_DELIVERY: {
      label: "Out for Delivery",
      className: "bg-purple-500 text-white",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-green-600 text-white",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-600 text-white",
    },
  };

  const { label, className } = statusConfig[status];

  return <Badge className={className}>{label}</Badge>;
};
