import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

function EmptyLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground text-xs border-dashed",
        className
      )}
    >
      {children}
    </div>
  );
}

export default EmptyLayout;
