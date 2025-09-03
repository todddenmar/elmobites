import { LoaderIcon } from "lucide-react";
import React from "react";

type LoadingComponentProps = {
  message?: string;
};
function LoadingComponent({ message }: LoadingComponentProps) {
  return (
    <div className="p-2 flex justify-center gap-2">
      <LoaderIcon className="animate-spin h-4 w-4" />{" "}
      <span className="animate-pulse">{message || "Please wait..."}</span>
    </div>
  );
}

export default LoadingComponent;
