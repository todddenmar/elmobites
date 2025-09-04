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
import CreateStoreForm from "./forms/CreateStoreForm";
function StoreCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant={"outline"} className="cursor-pointer">
            Create New Store
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Store</DialogTitle>
            <DialogDescription>Fill up the required fields</DialogDescription>
          </DialogHeader>
          <CreateStoreForm setClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StoreCreateButton;
