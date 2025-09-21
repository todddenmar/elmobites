"use client";

import { useState } from "react";
import { TOrder, TOrderItem, TOrderLog } from "@/typings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
// import { db } from "@/lib/firebase"; // 👈 adjust if using Firebase
// import { doc, updateDoc, increment } from "firebase/firestore";

type CancelOrderFormProps = {
  orderData: TOrder;
  setClose: () => void;
};

function CancelOrderForm({ orderData, setClose }: CancelOrderFormProps) {
  const { currentInventory, userData } = useAppStore();
  const [restockQuantities, setRestockQuantities] = useState<
    Record<string, number>
  >(() =>
    orderData.items.reduce((acc, item) => {
      acc[item.id] = item.quantity; // default = restock full qty
      return acc;
    }, {} as Record<string, number>)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (itemId: string, value: string) => {
    setRestockQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, Number(value) || 0), // prevent negatives
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Build list of items to restock
      const restockItems: TOrderItem[] = orderData.items.filter(
        (r) => r.quantity > 0
      );

      // Example Firestore update
      for (const item of restockItems) {
        // Assuming inventory doc ID = productID + variantID + branchID
        const inventoryData = currentInventory.find(
          (inv) => inv.id === item.inventoryID
        );
        const prevStock = inventoryData?.stock || 0;
        const updatedStock = prevStock + restockQuantities[item.id];
        const res = await dbUpdateDocument(
          DB_COLLECTION.INVENTORY,
          item.inventoryID,
          {
            stock: updatedStock,
          }
        );
        if (res.status === DB_METHOD_STATUS.ERROR) {
          console.log(res.message);
          return;
        }
      }
      const now = new Date().toISOString();

      const updatedLogs: TOrderLog[] = [...(orderData.logs || [])];
      updatedLogs.push({
        status: "CANCELLED",
        changedAt: now,
        changedBy: `${userData?.firstname} ${userData?.lastname}`,
      });
      const resOrder = await dbUpdateDocument(
        DB_COLLECTION.ORDERS,
        orderData.id,
        {
          status: "CANCELLED",
          logs: updatedLogs,
        }
      );
      if (resOrder.status === DB_METHOD_STATUS.ERROR) {
        console.log(resOrder.message);
        return;
      }
      toast.success("Order cancelled and items restocked ✅");
      setClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {orderData.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <Label>
                {item.productName}{" "}
                {item.variantName ? `- ${item.variantName}` : ""}
              </Label>
              <p className="text-sm text-muted-foreground">
                Ordered: {item.quantity}
              </p>
            </div>
            <Input
              type="number"
              className="w-24"
              min={0}
              max={item.quantity}
              value={restockQuantities[item.id]}
              onChange={(e) => handleChange(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={setClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Confirm Cancel"}
        </Button>
      </div>
    </form>
  );
}

export default CancelOrderForm;
