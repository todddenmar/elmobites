"use client";
import InventoryList from "@/components/admin/inventory/list/InventoryList";
import NoInventoryList from "@/components/admin/inventory/list/NoInventoryList";
import StockTransactionsLog from "@/components/admin/inventory/list/StockTransactionsLog";
import SelectBranchDropdown from "@/components/admin/inventory/SelectBranchDropdown";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { useAppStore } from "@/lib/store";
import { TInventoryListItem, TProductVariantItem } from "@/typings";
import React, { useEffect, useState } from "react";

function AdminInventoryPage() {
  const {
    currentProducts,
    currentInventory,
    currentStores,
    currentProductCategories,
  } = useAppStore();
  const [branch, setBranch] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<TInventoryListItem[]>([]);
  const [filteredProductVariants, setFilteredProductVariants] = useState<
    TProductVariantItem[]
  >([]);

  useEffect(() => {
    if (currentStores[0]) {
      setBranch(currentStores[0].id);
    }
  }, [currentStores]);

  useEffect(() => {
    const items = currentInventory;

    // ✅ Map all variants to inventory table rows (with or without inventory)
    const inventoryItems: TInventoryListItem[] = currentInventory.map(
      (item) => {
        const branchData = currentStores.find((b) => b.id === branch);
        const productData = currentProducts.find(
          (p) => p.id === item.productID
        );
        const variantData = productData?.variants.find(
          (v) => v.id === item.variantID
        );
        const categoryData = currentProductCategories.find(
          (c) => c.id === productData?.categoryID
        );

        const inventoryItem: TInventoryListItem = {
          ...item,
          branchName: branchData?.name || "",
          categoryName: categoryData?.name || "",
          productName: productData?.name || "",
          variantName: variantData?.name || "",
          price: variantData?.price || 0,
        };
        return inventoryItem;
      }
    );
    // ✅ Check for variants missing in inventory
    const inventoryKeys = new Set(
      items.map(
        (item) => `${item.productID}_${item.variantID}_${item.branchID}`
      )
    );
    const missingVariants: TProductVariantItem[] = [];

    currentProducts.forEach((product) => {
      product.variants.forEach((variant) => {
        const key = `${product.id}_${variant.id}_${branch}`;
        const exists =
          branch === "all"
            ? // if "all", check any branch
              currentInventory.some(
                (inv) =>
                  inv.productID === product.id && inv.variantID === variant.id
              )
            : inventoryKeys.has(key);

        if (!exists) {
          missingVariants.push({
            ...variant,
            productID: product.id,
            productName: product.name,
            productCreatedAt: product.createdAt,
          });
        }
      });
    });
    setFilteredProductVariants(missingVariants);
    setFilteredItems(inventoryItems);
  }, [
    currentInventory,
    branch,
    currentProducts,
    currentStores,
    currentProductCategories,
  ]);
  if (!branch) return <EmptyLayout>No Branch for Inventory</EmptyLayout>;

  return (
    <div className="flex flex-col gap-4 flex-1 h-full bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4 lg:flex justify-between items-center w-full">
        <SectionTitle>Inventory</SectionTitle>

        <div className="flex justify-between gap-4">
          <SelectBranchDropdown
            value={branch}
            onChange={(val) => setBranch(val)}
          />
        </div>
      </div>
      <div className="flex-1">
        {/* <AdminInventoryTable inventoryItems={filteredItems} /> */}
        <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          <NoInventoryList productVariants={filteredProductVariants} />
          <InventoryList inventoryItems={filteredItems} />
          <StockTransactionsLog branchID={branch} />
        </div>
      </div>
    </div>
  );
}

export default AdminInventoryPage;
