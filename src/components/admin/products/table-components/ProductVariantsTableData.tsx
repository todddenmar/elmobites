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
import Image from "next/image";
import { ImageIcon } from "lucide-react";
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
                    className="flex gap-4 border rounded-lg p-2"
                  >
                    <div className="rounded-lg relative overflow-hidden aspect-square">
                      {item.thumbnailImage ? (
                        <Image
                          src={item.thumbnailImage}
                          width={50}
                          height={50}
                          className="object-cover object-center h-full w-full"
                          alt={item.name}
                        />
                      ) : (
                        <ImageIcon
                          size={18}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>
                    <div>
                      <div>
                        {item.name} {item.size ? `(${item.size})` : null}
                      </div>
                      <div>{convertCurrency(item.price)}</div>
                    </div>
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
