import { convertCurrency, customDateFormat } from "@/lib/utils";
import { TOrder } from "@/typings";
import React from "react";
import { useAppStore } from "@/lib/store";
import { OrderStatusBadge } from "@/components/custom-ui/GlobalComponents";
import AdminOrdersActionButton from "./AdminOrdersActionButton";

type RecentOrderItemProps = {
  order: TOrder;
};

function RecentOrderItem({ order }: RecentOrderItemProps) {
  const { currentStores } = useAppStore();
  const branch = currentStores.find((item) => item.id === order.branchID);

  const createdDate = new Date(order.createdAt);
  const diffMs = Date.now() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Branch + Type */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          {OrderStatusBadge(order.status)}
          <AdminOrdersActionButton orderData={order} />
        </div>

        {/* Order ID + Customer */}
        <div className="text-sm space-y-1">
          <div className="font-medium">Order #{order.orderNumber}</div>
          <div className="flex items-center gap-2 justify-between">
            <span className="font-medium">Branch: </span>
            <span>{branch?.name || "Unknown Branch"}</span>
          </div>
          {order.customer && (
            <div className="flex items-center gap-2 justify-between">
              <span className="font-medium">Customer: </span>
              <span className="text-muted-foreground">
                {order.customer.fullName}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 justify-between">
            <span className="font-medium">Total Amount: </span>
            <span>{convertCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground items-center flex justify-between">
          <div>{customDateFormat(createdDate, true)}</div>
          <div>
            {diffMinutes} minute{diffMinutes !== 1 ? "s" : ""} ago
          </div>
        </div>
      </div>

      {/* Status + Action */}
      <div className="flex items-center text-sm gap-2 p-2 bg-black text-white justify-center">
        {order.orderType}
      </div>
    </div>
  );
}

export default RecentOrderItem;
