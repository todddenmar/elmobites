"use client";

import { TProduct } from "@/typings";
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
import UpdateProductForm from "./forms/UpdateProductForm";

type ProductActionButtonProps = {
  productData: TProduct;
};

function ProductActionButton({ productData }: ProductActionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {productData.name}</DialogTitle>
            <DialogDescription>Fill up all required fields</DialogDescription>
          </DialogHeader>
          <UpdateProductForm
            product={productData}
            setClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductActionButton;
