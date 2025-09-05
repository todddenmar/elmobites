import { convertCurrency, pluralize } from "@/lib/utils";
import { TProduct } from "@/typings";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
type ProductVariantsTableDataProps = {
  product: TProduct;
};
function ProductVariantsTableData({ product }: ProductVariantsTableDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const variants = product.variants;
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="cursor-pointer" variant={"link"}>
            {pluralize({
              number: variants.length,
              plural: "Variants",
              singular: "Variant",
            })}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>{product.description}</DialogDescription>
          </DialogHeader>
          <div>
            <ul className="space-y-2">
              {variants.map((item) => {
                return (
                  <li
                    key={`product-variant-${item.id}`}
                    className="flex justify-between items-center gap-4 border rounded-lg p-4"
                  >
                    <div>
                      {item.name} {item.size ? `(${item.size})` : null}
                    </div>
                    <div>{convertCurrency(item.price)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductVariantsTableData;
