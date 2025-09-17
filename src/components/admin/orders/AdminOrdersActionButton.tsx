"use client";

import { TOrder } from "@/typings";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type AdminOrdersActionButtonProps = {
  orderData: TOrder;
};

function AdminOrdersActionButton({ orderData }: AdminOrdersActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsOpenStatus(true);
              setOpen(false);
            }}
          >
            Update Status
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
    </>
  );
}

export default AdminOrdersActionButton;
