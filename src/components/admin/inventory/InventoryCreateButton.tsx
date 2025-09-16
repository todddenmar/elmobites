import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateInventoryForm from "./forms/CreateInventoryForm";
import { TProductVariantItem } from "@/typings";
import { PackagePlusIcon } from "lucide-react";
type InventoryCreateButtonProps = {
  productVariantItem: TProductVariantItem;
};
function InventoryCreateButton({
  productVariantItem,
}: InventoryCreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        size={"icon"}
        type="button"
        variant={"outline"}
        className="cursor-pointer"
      >
        <PackagePlusIcon />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${productVariantItem.productName} (${productVariantItem.name})`}</DialogTitle>
            <DialogDescription>
              Creating an inventory data for this product
            </DialogDescription>
          </DialogHeader>
          <CreateInventoryForm
            productVariantItem={productVariantItem}
            setClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InventoryCreateButton;
