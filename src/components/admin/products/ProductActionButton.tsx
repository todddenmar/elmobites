import { TProduct } from "@/typings";
import React from "react";

type ProductActionButtonProps = {
  productData: TProduct;
};
function ProductActionButton({ productData }: ProductActionButtonProps) {
  return <div>{productData.name}</div>;
}

export default ProductActionButton;
