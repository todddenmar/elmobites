"use client";
import { TypographyH4 } from "@/components/custom-ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, customDateFormat } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { endOfDay, startOfDay } from "date-fns";
import { DB_COLLECTION } from "@/lib/config";
import { TInventoryTransactionLog } from "@/typings";
import { useAppStore } from "@/lib/store";

type StockTransactionsLogProps = {
  branchID: string;
};

function StockTransactionsLog({ branchID }: StockTransactionsLogProps) {
  const { currentInventory, currentProducts } = useAppStore();
  const [transactionLogs, setTransactionLogs] = useState<
    TInventoryTransactionLog[]
  >([]);

  const getIventoryInfo = (id: string) => {
    console.log({ id, currentInventory });
    const inventory = currentInventory.find((item) => item.id === id);
    const product = currentProducts.find(
      (item) => item.id === inventory?.productID
    );
    const variant = product?.variants.find(
      (item) => item.id === inventory?.variantID
    );
    console.log({ inventory, product, variant });
    return { inventory, product, variant };
  };

  useEffect(() => {
    const start = Timestamp.fromDate(startOfDay(new Date()));
    const end = Timestamp.fromDate(endOfDay(new Date()));

    const ref = collection(db, DB_COLLECTION.INVENTORY_TRANSACTIONS_LOGS);
    const q = query(
      ref,
      where("storeID", "==", branchID),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end),
      orderBy("timestamp", "desc") // 👈 add orderBy for descending
    );

    // 🔥 Realtime listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results: TInventoryTransactionLog[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      ) as TInventoryTransactionLog[];
      setTransactionLogs(results);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg border">
      <TypographyH4>Today&apos;s Transaction Logs</TypographyH4>
      <ScrollArea className="h-[500px] border rounded-lg">
        <div className="flex flex-col gap-2 p-2">
          {transactionLogs.map((item) => {
            const { product, variant } = getIventoryInfo(item.inventoryID);
            return (
              <div
                key={`inventory-item-${item.id}`}
                className="p-2 space-y-2 rounded-lg border text-sm h-fit"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "font-semibold",
                      item.type === "ADD"
                        ? "text-green-500"
                        : "text-destructive"
                    )}
                  >
                    {item.type === "ADD" ? "+" : "-"} {item.stockAmount}{" "}
                  </div>
                  <div>
                    <div className="font-semibold">{`${product?.name} (${variant?.name})`}</div>
                    <p>{item.notes}</p>
                  </div>
                </div>
                <div className="flex text-xs text-muted-foreground justify-between gap-2">
                  <div className="">
                    {customDateFormat(new Date(item.createdAt), true)}
                  </div>
                  <div>By: {item.userName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default StockTransactionsLog;
