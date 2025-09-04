"use client";

import { TStore } from "@/typings";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import UpdateStoreForm from "./forms/UpdateStoreForm";

type StoreActionButtonProps = {
  storeData: TStore;
};

function StoreActionButton({ storeData }: StoreActionButtonProps) {
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
            Edit Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {storeData.name}</DialogTitle>
          </DialogHeader>
          <UpdateStoreForm store={storeData} setClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StoreActionButton;
