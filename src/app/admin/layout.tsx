"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData } = useAppStore();
  const router = useRouter();
  useEffect(() => {
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS!;
    const isAdmin = userData ? adminEmails.includes(userData?.email) : false;
    if (!isAdmin) {
      router.push("/");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  if (!userData) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-1 bg-neutral-50">
      <AdminSidebar />
      <div className="p-4  flex-1">
        <div className="p-4 bg-white rounded-lg flex-1 h-full">{children}</div>
      </div>
    </div>
  );
}

export default AdminRootLayout;
