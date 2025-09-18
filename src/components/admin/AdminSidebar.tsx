import { cn } from "@/lib/utils";
import { TAdminLink } from "@/typings";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { adminLinks } from "../custom-ui/GlobalComponents";

function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-fit h-full hidden lg:block group">
      <div className="h-full flex flex-col">
        <ul>
          {adminLinks.map((item) => {
            return (
              <li
                key={`admin-link-${item.id}`}
                className={cn(
                  "transition-all duration-150 rounded-lg",
                  item.path === "/admin"
                    ? pathname === "/admin"
                      ? "bg-black text-white"
                      : "hover:bg-black/5"
                    : pathname.startsWith(item.path)
                    ? "bg-black text-white"
                    : "hover:bg-black/5"
                )}
              >
                <AdminSidebarItem props={item} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

type AdminSidebarItemProps = {
  props: TAdminLink;
};
function AdminSidebarItem({ props }: AdminSidebarItemProps) {
  return (
    <Link href={props.path} className="block">
      <div className="px-4 py-3 flex items-center">
        <div>{props.icon}</div>
        <div
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
            "opacity-0 w-0 group-hover:opacity-100 group-hover:w-32 group-hover:pl-2"
          )}
        >
          {props.label}
        </div>
      </div>
    </Link>
  );
}

export default AdminSidebar;
