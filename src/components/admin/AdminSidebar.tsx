import { cn } from "@/lib/utils";
import { TAdminLink } from "@/typings";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { adminLinks } from "../custom-ui/GlobalComponents";

function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-[300px] h-full hidden lg:block">
      <div className="h-full p-2 flex flex-col">
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
    <Link href={props.path}>
      <div className="px-4 py-3 flex gap-2  items-center">
        <div>{props.icon}</div>
        <div>{props.label}</div>
      </div>
    </Link>
  );
}

export default AdminSidebar;
