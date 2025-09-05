import { useAppStore } from "@/lib/store";
import React from "react";

type ProductCategoryTableDataProps = {
  id: string;
};
function ProductCategoryTableData({ id }: ProductCategoryTableDataProps) {
  const { currentProductCategories } = useAppStore();
  const category = currentProductCategories.find((item) => item.id === id);
  return <div>{category?.name}</div>;
}

export default ProductCategoryTableData;
