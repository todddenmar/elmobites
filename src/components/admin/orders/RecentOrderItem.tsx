import { Badge } from "@/components/ui/badge";
import { customDateFormat } from "@/lib/utils";
import { TOrder } from "@/typings";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewOrderDialog from "./ViewOrderDialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
type RecentOrderItemProps = {
  order: TOrder;
};
function RecentOrderItem({ order }: RecentOrderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentStores } = useAppStore();
  const branch = currentStores.find((item) => item.id === order.branchID);
  return (
    <div className="border rounded-lg p-2 space-y-2">
      <div className="flex items-center gap-4 justify-between text-sm">
        <div>{branch?.name}</div>
        <Badge>{order.orderType}</Badge>
      </div>
      <div className="text-sm">
        {customDateFormat(new Date(order.createdAt), true)}
      </div>
      <div className="flex items-center gap-2">
        <div className="border p-2 flex-1 rounded-lg text-sm text-center">
          {order.status}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant={"secondary"}>
              View Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader hidden>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <ViewOrderDialog order={order} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default RecentOrderItem;
