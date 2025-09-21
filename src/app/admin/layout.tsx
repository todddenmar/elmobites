"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAppStore } from "@/lib/store";
import React, { useEffect, useState } from "react";
import LoadingCard from "@/components/custom-ui/LoadingCard";

function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  type Status = "loading" | "ready" | "error" | "unauthorized";

  const [status, setStatus] = useState<Status>("loading");
  const { userData } = useAppStore();

  useEffect(() => {
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
    if (!userData) {
      setStatus("unauthorized");
      return;
    }
    const isAdmin = adminEmails.includes(userData.email);
    if (!isAdmin) {
      setStatus("unauthorized");
    } else {
      setStatus("ready");
    }
  }, [userData]);

  if (status === "unauthorized" || status === "loading") {
    return (
      <LoadingCard
        title="Loading..."
        description="Trying to access the admin page."
        linkText="Go back to homepage"
        redirectionLink="/"
      />
    );
  }

  return (
    <div className="flex flex-1 bg-neutral-50 lg:p-4 gap-4">
      <AdminSidebar />
      <div className="flex-1">
        <div className="lg:p-4 bg-neutral-100 rounded-lg flex-1 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminRootLayout;
