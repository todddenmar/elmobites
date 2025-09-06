import React, { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { toast } from "sonner";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { TProduct } from "@/typings";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";

type ProductPublishSwitchProps = {
  product: TProduct;
};
function ProductPublishSwitch({ product }: ProductPublishSwitchProps) {
  const { currentProducts, setCurrentProducts } = useAppStore();
  const [isPublished, setIsPublished] = useState(product.isPublished);
  const onChangePublicStatus = async (newStatus: boolean) => {
    const res = await dbUpdateDocument(DB_COLLECTION.PRODUCTS, product.id, {
      isPublished: newStatus,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    setIsPublished(!product.isPublished);
    const updatedProduct = {
      ...product,
      isPublished: newStatus,
    };
    const updatedProducts = currentProducts.map((item) =>
      item.id === product.id ? updatedProduct : item
    );
    setCurrentProducts(updatedProducts);
    toast.success(
      newStatus
        ? "Product published successfully"
        : "This product is now hidden to public"
    );
  };
  return (
    <div>
      <Switch
        className="cursor-pointer"
        checked={isPublished}
        onCheckedChange={onChangePublicStatus}
      />
    </div>
  );
}

export default ProductPublishSwitch;
