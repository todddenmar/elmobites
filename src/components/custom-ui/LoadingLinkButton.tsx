import React, { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import LoadingComponent from "./LoadingComponent";

type LoadingLinkButtonProps = {
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

function LoadingLinkButton({
  className,
  children,
  asChild,
  type,
}: LoadingLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onLoading = () => {
    setIsLoading(true);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Button
          type={type}
          asChild={asChild}
          onClick={onLoading}
          className={cn(className)}
        >
          {children}
        </Button>
      )}
    </div>
  );
}

export default LoadingLinkButton;
