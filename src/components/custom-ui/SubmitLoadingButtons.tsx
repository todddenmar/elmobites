import React, { useState } from "react";
import { Button } from "../ui/button";
import LoadingComponent from "./LoadingComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SubmitLoadingButtonsProps = {
  setClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isLoading: boolean;
  disabled?: boolean;
};
function SubmitLoadingButtons({
  setClose,
  onSubmit,
  onDelete,
  isLoading,
  disabled = false,
}: SubmitLoadingButtonsProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  return isLoading ? (
    <LoadingComponent />
  ) : (
    <div className="grid grid-cols-2 gap-4">
      {onDelete !== undefined ? (
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => setIsConfirmingDelete(true)}
        >
          Delete
        </Button>
      ) : (
        <Button type="button" variant={"destructive"} onClick={setClose}>
          Cancel
        </Button>
      )}

      <Button disabled={disabled} type="button" onClick={onSubmit}>
        Submit
      </Button>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              prize item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 items-center gap-4">
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubmitLoadingButtons;
