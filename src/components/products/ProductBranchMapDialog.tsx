import React from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPinnedIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  { ssr: false }
);

type ProductBranchMapDialogProps = {
  branchID: string;
};
function ProductBranchMapDialog({ branchID }: ProductBranchMapDialogProps) {
  const { currentStores } = useAppStore();
  const branch = currentStores.find((item) => item.id === branchID);
  if (!branch) return null;
  const [lat, lng] = branch.coordinates
    .split(",")
    .map((c) => parseFloat(c.trim()));
  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 cursor-pointer">
          <MapPinnedIcon size={18} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{branch.name}</DialogTitle>
            <DialogDescription>{branch.location}</DialogDescription>
          </DialogHeader>
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <MapWithMarker
              position={[lat, lng]}
              setPosition={() => {}}
              isMarkerDraggable={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductBranchMapDialog;
