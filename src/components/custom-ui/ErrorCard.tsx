"use client";
import { cn } from "@/lib/utils";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import LoadingComponent from "../custom-ui/LoadingComponent";

type ErrorCardProps = {
  title: string;
  description: string;
  redirectionLink: string;
  linkText: string;
  variant?: "default" | "success";
};
function ErrorCard({
  title,
  description,
  redirectionLink,
  linkText,
  variant = "default",
}: ErrorCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 p-4">
      <div className="bg-white/5 dark:bg-neutral-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <CircleAlertIcon
          className={cn(
            "w-16 h-16 mx-auto mb-4",
            variant ? "text-red-500" : "text-green-500"
          )}
        />
        <h1 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">
          {title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
          {description}
        </p>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Link
            onClick={() => setIsLoading(true)}
            href={redirectionLink}
            className={cn(
              "inline-block px-6 py-2 rounded-xl  text-white  transition",
              variant
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            )}
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default ErrorCard;
