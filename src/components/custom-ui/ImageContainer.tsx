import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
interface IImageContainerProps {
  children?: ReactNode;
  className?: string;
}
function ImageContainer({ children, className }: IImageContainerProps) {
  return (
    <div
      className={cn(
        "bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex flex-col items-center justify-center text-zinc-100 dark:text-zinc-500",
        className
      )}
    >
      {children}
    </div>
  );
}

export default ImageContainer;
