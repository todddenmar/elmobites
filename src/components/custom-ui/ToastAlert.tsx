import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import React, { ReactNode } from "react";

type ToastAlertProps = {
  title: string;
  description: ReactNode;
  className?: string;
  icon: ReactNode;
};
function ToastAlert({ title, description, className, icon }: ToastAlertProps) {
  return (
    <div>
      <Alert variant="default" className={cn(className)}>
        {icon}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}

export default ToastAlert;
