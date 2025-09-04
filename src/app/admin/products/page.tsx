"use client";
import { AdminProductsTable } from "@/components/admin/products/AdminProductsTable";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { useAppStore } from "@/lib/store";
import React from "react";

function AdminProductsPage() {
  const { currentProducts } = useAppStore();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <SectionTitle>Products</SectionTitle>
      <div className="flex-1">
        <AdminProductsTable products={currentProducts} />
      </div>
    </div>
  );
}

export default AdminProductsPage;
