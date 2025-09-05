import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
type GalleryImageActionButtonProps = {
  onDelete: () => void;
  onView: () => void;
  onChangeFeature: () => void;
  onChangeFeatureOrder: () => void;
  isFeatured: boolean;
};
function GalleryImageActionButton({
  onDelete,
  onView,
  onChangeFeature,
  onChangeFeatureOrder,
  isFeatured,
}: GalleryImageActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"icon"} type="button">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            onView();
            setIsOpen(false);
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onChangeFeature();
            setIsOpen(false);
          }}
        >
          {isFeatured ? "Remove from featured" : "Add to featured list"}
        </DropdownMenuItem>
        {isFeatured && (
          <DropdownMenuItem
            onClick={() => {
              onChangeFeatureOrder();
              setIsOpen(false);
            }}
          >
            Change Order
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            onDelete();
            setIsOpen(false);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GalleryImageActionButton;
