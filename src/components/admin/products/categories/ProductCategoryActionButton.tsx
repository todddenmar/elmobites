"use client";

import { TProductCategory } from "@/typings";
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
import UpdateProductCategoryForm from "./UpdateProductCategoryForm";

type ProductCategoryActionButtonProps = {
  categoryData: TProductCategory;
};

function ProductCategoryActionButton({
  categoryData,
}: ProductCategoryActionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {categoryData.name}</DialogTitle>
            <DialogDescription>Fill up all required fields</DialogDescription>
          </DialogHeader>
          <UpdateProductCategoryForm
            category={categoryData}
            setClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductCategoryActionButton;
