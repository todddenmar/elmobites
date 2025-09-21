"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CancelOrderForm from "./forms/CancelOrderForm";
import OrderStatusForm from "./forms/OrderStatusForm";
import { TOrder } from "@/typings";
import { Button } from "@/components/ui/button";
type AdminOrderButtonsProps = {
  orderData: TOrder;
};
function AdminOrderButtons({ orderData }: AdminOrderButtonsProps) {
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);

  return (
    <div className="flex gap-2 lg:gap-4 items-center">
      <Dialog open={isOpenStatus} onOpenChange={setIsOpenStatus}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" type="button">
            Change Status
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Status</DialogTitle>
            <DialogDescription>
              You can update the order&apos;s status here.
            </DialogDescription>
          </DialogHeader>
          <OrderStatusForm orderData={orderData} />
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenCancel} onOpenChange={setIsOpenCancel}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            type="button"
            variant={"destructive"}
          >
            Cancel Order
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cancel Order #{orderData.orderNumber}</DialogTitle>
            <DialogDescription>
              Adjust quantities to restock. Leave 0 if you don&apos;t want to
              restock that item.
            </DialogDescription>
          </DialogHeader>
          <CancelOrderForm
            orderData={orderData}
            setClose={() => setIsOpenCancel(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminOrderButtons;
