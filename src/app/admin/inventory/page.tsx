"use client";
import { AdminInventoryTable } from "@/components/admin/inventory/AdminInventoryTable";
import InventoryCreateButton from "@/components/admin/inventory/InventoryCreateButton";
import SelectBranchDropdown from "@/components/admin/inventory/SelectBranchDropdown";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { useAppStore } from "@/lib/store";
import { TInventoryTableItem } from "@/typings";
import React, { useEffect, useState } from "react";

function AdminInventoryPage() {
  const {
    currentProducts,
    currentInventory,
    currentStores,
    currentProductCategories,
  } = useAppStore();
  const [branch, setBranch] = useState("all");
  const [filteredItems, setFilteredItems] = useState<TInventoryTableItem[]>([]);

  useEffect(() => {
    let items = currentInventory;
    if (branch != "all") {
      items = items.filter((item) => item.branchID === branch);
    }
    const inventoryTableItems = items.map((inventoryItem) => {
      const product = currentProducts.find(
        (item) => item.id === inventoryItem.productID
      );
      const variant = product?.variants.find(
        (item) => item.id === inventoryItem.variantID
      );
      const branch = currentStores?.find(
        (item) => item.id === inventoryItem.branchID
      );

      const category = currentProductCategories.find(
        (item) => item.id === product?.categoryID
      );
      const result: TInventoryTableItem = {
        ...inventoryItem,
        productName: product?.name || "",
        variantName: variant?.name || "",
        branchName: branch?.name || "",
        categoryName: category?.name || "",
        price: variant?.price || 0,
      };
      return result;
    });
    setFilteredItems(inventoryTableItems);
  }, [
    currentInventory,
    branch,
    currentProducts,
    currentStores,
    currentProductCategories,
  ]);

  return (
    <div className="flex flex-col gap-4 flex-1 h-full">
      <div className="grid grid-cols-1 gap-4 lg:flex justify-between items-center w-full">
        <SectionTitle>Inventory</SectionTitle>

        <div className="flex justify-between gap-4">
          <SelectBranchDropdown
            value={branch}
            onChange={(val) => setBranch(val)}
          />
          <InventoryCreateButton />
        </div>
      </div>
      <div className="flex-1 p-4 rounded-lg border grid">
        <AdminInventoryTable inventoryItems={filteredItems} />
      </div>
    </div>
  );
}

export default AdminInventoryPage;
