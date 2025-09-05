import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateInventoryForm from "./forms/CreateInventoryForm";
function InventoryCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant={"outline"} className="cursor-pointer">
            Create New Inventory
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Inventory</DialogTitle>
            <DialogDescription>Fill up the required fields</DialogDescription>
          </DialogHeader>
          <CreateInventoryForm setClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InventoryCreateButton;
