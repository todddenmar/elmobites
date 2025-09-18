"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { adminLinks } from "../custom-ui/GlobalComponents";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="block lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button type="button" size={"icon"}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="hidden">
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col h-full">
            <div className="flex flex-col gap-4">
              <div className="font-main p-4 flex flex-col text-6xl items-center justify-center">
                <div>The</div>
                <div>Cake</div>
                <div>Co.</div>
              </div>
              <ul className="flex flex-col">
                {adminLinks.map((item) => {
                  return (
                    <li
                      key={`mobile-admin-link-${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "transition-all duration-150 px-4 py-3",
                        pathname === item.path
                          ? "bg-black text-white"
                          : "hover:bg-black/5"
                      )}
                    >
                      <Link href={item.path} className="block">
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminMobileMenu;
