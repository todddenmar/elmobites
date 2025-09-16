import { TypographyH4 } from "@/components/custom-ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertCurrency } from "@/lib/utils";
import { TInventoryListItem } from "@/typings";
import React from "react";
import StockTransactionButtons from "../buttons/StockTransactionButtons";

type InventoryListProps = {
  inventoryItems: TInventoryListItem[];
};

function InventoryList({ inventoryItems }: InventoryListProps) {
  const sortByProductID = [...inventoryItems].sort((a, b) =>
    a.productName < b.productName ? -1 : 1
  );

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <TypographyH4>In Stock</TypographyH4>
      <ScrollArea className="h-[500px] border rounded-lg">
        <div className="flex flex-col gap-2 p-2">
          {sortByProductID.map((item) => {
            return (
              <div
                key={`inventory-item-${item.id}`}
                className="p-2 rounded-lg border text-sm h-fit"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {item.productName} {`(${item.variantName})`}
                    </div>
                    <div>{convertCurrency(item.price)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StockTransactionButtons inventoryItem={item} />
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

export default InventoryList;
