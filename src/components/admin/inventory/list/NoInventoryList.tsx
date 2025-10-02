import { TypographyH4 } from "@/components/custom-ui/typography";
import { convertCurrency, customDateFormat } from "@/lib/utils";
import { TProductVariantItem } from "@/typings";
import React from "react";
import InventoryCreateButton from "../InventoryCreateButton";
import { ScrollArea } from "@/components/ui/scroll-area";

type NoInventoryListProps = {
  productVariants: TProductVariantItem[];
};
function NoInventoryList({ productVariants }: NoInventoryListProps) {
  const sortByProductName = productVariants.sort((a, b) =>
    a.productName < b.productName ? -1 : 1
  );
  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg border">
      <TypographyH4>Available For Stocking</TypographyH4>
      <ScrollArea className="h-[500px] border rounded-lg">
        <div className="flex flex-col gap-2 p-2">
          {sortByProductName.map((item) => {
            return (
              <div
                key={`product-variant-item-${item.id}`}
                className="p-2 rounded-lg border text-sm h-fit"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold ">
                      {item.productName} {`(${item.name})`}
                    </div>
                    <div>{convertCurrency(item.price)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <InventoryCreateButton productVariantItem={item} />
                    <div>
                      {customDateFormat(new Date(item.productCreatedAt))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default NoInventoryList;
