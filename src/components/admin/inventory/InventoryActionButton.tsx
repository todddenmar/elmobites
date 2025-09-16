"use client";

import { TInventoryListItem } from "@/typings";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import UpdateInventoryForm from "./forms/UpdateInventoryForm";
import { toast } from "sonner";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbDeleteDocumentByID } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";

type InventoryActionButtonProps = {
  inventoryData: TInventoryListItem;
};

function InventoryActionButton({ inventoryData }: InventoryActionButtonProps) {
  const { currentInventory, setCurrentInventory } = useAppStore();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await dbDeleteDocumentByID({
        collectionName: DB_COLLECTION.INVENTORY,
        id: inventoryData.id,
      });

      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message || "Failed to delete inventory item");
      } else {
        toast.success("Inventory item deleted successfully");

        // ✅ Update store immediately
        setCurrentInventory(
          currentInventory.filter((item) => item.id !== inventoryData.id)
        );

        setOpenDelete(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setOpenDelete(true)}
          >
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>Fill up all required fields</DialogDescription>
          </DialogHeader>
          <UpdateInventoryForm
            inventoryData={inventoryData}
            setClose={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{`${inventoryData.productName} - ${inventoryData.variantName}`}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InventoryActionButton;
