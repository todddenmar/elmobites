"use client";
import { AdminProductsTable } from "@/components/admin/products/AdminProductsTable";
import ProductCategoryCreateButton from "@/components/admin/products/categories/ProductCategoryCreateButton";
import ProductCreateButton from "@/components/admin/products/ProductCreateButton";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { TypographyH4 } from "@/components/custom-ui/typography";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TProduct } from "@/typings";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function AdminProductsPage() {
  const { currentProducts, currentProductCategories } = useAppStore();
  const [selectedCategoryID, setSelectedCategoryID] = useState<string | null>(
    null
  );

  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    if (!selectedCategoryID) {
      setFilteredProducts(currentProducts);
      return;
    }
    const filtered = currentProducts.filter(
      (p) => p.categoryID === selectedCategoryID
    );
    setFilteredProducts(filtered);
  }, [selectedCategoryID, currentProducts]);
  return (
    <div className="flex flex-col gap-4 flex-1 h-full">
      <div className="flex justify-between items-center">
        <SectionTitle>Products</SectionTitle>

        <ProductCreateButton />
      </div>

      <div className="grid lg:flex gap-4 flex-1">
        <div className="w-full lg:max-w-xs border rounded-lg p-4 h-fit space-y-4">
          <div className="space-y-2">
            <TypographyH4>Filter By Category</TypographyH4>

            {currentProductCategories.length > 0 ? (
              <div className="flex flex-col gap-2">
                {currentProductCategories
                  .sort((a, b) => (a.name < b.name ? -1 : 1))
                  .map((item) => {
                    const isActive = selectedCategoryID === item.id;
                    return (
                      <div
                        key={`category-${item.id}`}
                        onClick={() => setSelectedCategoryID(item.id)}
                        className={cn(
                          "border rounded-lg cursor-pointer p-2 text-sm",
                          isActive ? "bg-black text-white" : "hover:bg-black/5"
                        )}
                      >
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs">{item.tags}</div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <EmptyLayout>No Categories</EmptyLayout>
            )}
          </div>
          <div className="space-y-2">
            {selectedCategoryID ? (
              <Button
                type="button"
                variant={"secondary"}
                className="cursor-pointer w-full"
                onClick={() => setSelectedCategoryID(null)}
              >
                <XIcon /> Clear Filter
              </Button>
            ) : null}
            <ProductCategoryCreateButton />
          </div>
        </div>
        <div className="flex-1 p-4 rounded-lg border grid">
          <AdminProductsTable products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export default AdminProductsPage;
