import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { Button } from "@/components/ui/button";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbSetDocument } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import {
  TInventory,
  TInventoryListItem,
  TInventoryTransactionLog,
  TTransactionType,
} from "@/typings";
import { serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
type StockTransactionButtonsProps = {
  inventoryItem: TInventoryListItem;
};
function StockTransactionButtons({
  inventoryItem,
}: StockTransactionButtonsProps) {
  const { currentInventory, setCurrentInventory, userData } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [stockAmount, setStockAmount] = useState(1);
  const [type, setType] = useState<TTransactionType | null>(null);
  const [notes, setNotes] = useState("");
  const [isOpenForm, setIsOpenForm] = useState(false);

  const stockTransactionNotes = {
    ADD: [
      "New stock received from supplier",
      "Returned item added back to inventory",
      "Manual adjustment (correction)",
      "Transfer received from Branch:",
    ],
    REMOVE: [
      "Sold to customer (walk-in)",
      "Damaged/expired item removed",
      "Manual adjustment (correction)",
      "Transfer sent to Branch:",
    ],
  };
  useEffect(() => {
    if (type) setNotes(stockTransactionNotes[type][0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const onChangeStock = async () => {
    setIsLoading(true);
    const newTotalStock =
      type === "ADD"
        ? inventoryItem.stock + stockAmount
        : inventoryItem.stock - stockAmount;
    const updatedInventoryItem: TInventory = {
      ...inventoryItem,
      stock: newTotalStock,
      updatedAt: new Date().toISOString(),
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.INVENTORY,
      data: updatedInventoryItem,
      id: updatedInventoryItem.id,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      toast.error("Error updating inventory");
    } else {
      addLog({
        notes: notes,
        storeID: inventoryItem.branchID,
      });
      const updatedInventory = currentInventory.map((item) =>
        item.id === inventoryItem.id ? updatedInventoryItem : item
      );
      setCurrentInventory(updatedInventory);
      toast.success("Inventory created successfully");
      setIsOpenForm(false);
    }
    setStockAmount(1);
    setNotes("");
    setIsLoading(false);
  };

  const addLog = async ({
    notes,
    storeID,
  }: {
    notes: string;
    storeID: string;
  }) => {
    if (!userData) return;
    const newLog: TInventoryTransactionLog = {
      id: crypto.randomUUID(),
      userID: userData?.id,
      userName: `${userData?.firstname} ${userData?.lastname}`,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      notes: notes,
      type: type,
      stockAmount: stockAmount,
      storeID: storeID,
      inventoryID: inventoryItem.id,
    };
    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.INVENTORY_TRANSACTIONS_LOGS,
      id: newLog.id,
      data: newLog,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
  };
  return (
    <div className="grid grid-cols-3 text-center items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setType("REMOVE");
          setIsOpenForm(true);
        }}
      >
        -
      </Button>
      <span>{inventoryItem.stock}</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setType("ADD");
          setIsOpenForm(true);
        }}
      >
        +
      </Button>

      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {inventoryItem.productName} {`(${inventoryItem.variantName})`}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently change the
              stocks of this inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>{inventoryItem.stock}</div>
              <div>{type === "ADD" ? "+" : "-"}</div>
              <Input
                type="number"
                className="w-fit"
                value={stockAmount}
                onChange={(val) => setStockAmount(parseInt(val.target.value))}
              />
              <div className="flex items-center gap-2">
                =
                <span>
                  {type === "ADD"
                    ? inventoryItem.stock + stockAmount
                    : inventoryItem.stock - stockAmount}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(val) => setNotes(val.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(type ? stockTransactionNotes[type] : []).map((n) => (
                  <Badge
                    key={n}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setNotes(n)}
                  >
                    {n}
                  </Badge>
                ))}
              </div>
            </div>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => setIsOpenForm(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={() => onChangeStock()}>
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StockTransactionButtons;
