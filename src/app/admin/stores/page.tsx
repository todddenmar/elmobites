"use client";
import StoreCreateButton from "@/components/admin/stores/StoreCreateButton";
import { AdminStoresTable } from "@/components/admin/stores/StoresTable";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { useAppStore } from "@/lib/store";
import React from "react";

function AdminStoresPage() {
  const { currentStores } = useAppStore();
  return (
    <div className="flex flex-col gap-4 flex-1 bg-white/5 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <SectionTitle>Stores</SectionTitle>

        <StoreCreateButton />
      </div>
      <div className="flex-1 grid">
        <AdminStoresTable stores={currentStores} />
      </div>
    </div>
  );
}

export default AdminStoresPage;
