"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Button } from "../ui/button";

type LoadingCardProps = {
  title: string;
  description: string;
  redirectionLink: string;
  linkText: string;
};
function LoadingCard({
  title,
  description,
  redirectionLink,
  linkText,
}: LoadingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 p-4">
      <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 animate-pulse text-neutral-900 dark:text-white">
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
              "inline-block px-6 py-2 rounded-xl  text-white  transition"
            )}
          >
            <Button className="cursor-pointer" type="button">
              {linkText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default LoadingCard;
