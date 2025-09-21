"use client";

import { TOrder } from "@/typings";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import OrderStatusForm from "./forms/OrderStatusForm";
import Link from "next/link";
import CancelOrderForm from "./forms/CancelOrderForm";

type AdminOrdersActionButtonProps = {
  orderData: TOrder;
};

function AdminOrdersActionButton({ orderData }: AdminOrdersActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Order #{orderData.orderNumber}</DropdownMenuLabel>
          <Link href={"/admin/orders/" + orderData.id}>
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
              }}
            >
              View Order
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => {
              setIsOpenStatus(true);
              setOpen(false);
            }}
          >
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpenCancel(true);
              setOpen(false);
            }}
          >
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpenStatus} onOpenChange={setIsOpenStatus}>
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
    </>
  );
}

export default AdminOrdersActionButton;
