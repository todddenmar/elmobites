import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TMediaFile } from "@/typings";
function SelectImageFromGallery({
  galleryImages,
  value,
  onChange,
}: {
  galleryImages: TMediaFile[];
  value: string | null;
  onChange: (val: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => setIsOpen(true)}
          >
            Select from gallery
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gallery Images</DialogTitle>
            <DialogDescription>Choose an image from gallery.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto h-[300px]">
            <div className="grid grid-cols-3 gap-4">
              {galleryImages?.map((item, idx) => {
                const isActive = value === item.url;
                return (
                  <div
                    key={`choose-gallery-image-item-${idx}`}
                    className={cn(
                      "rounded-lg bg-white/5 overflow-hidden h-fit cursor-pointer",
                      isActive ? "border border-white" : ""
                    )}
                    onClick={() => {
                      if (isActive) {
                        onChange(null);
                      } else {
                        onChange(item.url);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <Image
                      src={item.url}
                      alt={item.name}
                      className="w-40 h-40 object-cover"
                      width={160}
                      height={160}
                      style={{
                        overflowClipMargin: "unset",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SelectImageFromGallery;
