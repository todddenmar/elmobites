import { cn } from "@/lib/utils";
import { ShirtIcon, StarIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

type CarouselImageCardProps = {
  onClickImage: () => void;
  onClickDelete: () => void;
  onClickThumbnail: () => void;
  isThumbnail: boolean;
  alt: string;
  src: string | null;
  className?: string;
  isHideThumbnail?: boolean;
};
function CarouselImageCard({
  onClickImage,
  onClickDelete,
  onClickThumbnail,
  isThumbnail,
  alt,
  src,
  className,
  isHideThumbnail,
}: CarouselImageCardProps) {
  return (
    <div
      onDoubleClick={onClickImage}
      className={cn(
        "aspect-[3/4] bg-lightblue overflow-hidden w-full rounded-lg relative",
        className
      )}
    >
      {src === null ? (
        <div className="flex items-center justify-center h-full w-full">
          <ShirtIcon size={40} className="text-white" />
        </div>
      ) : (
        <Image
          alt={alt}
          src={src}
          width={400}
          height={400}
          className="object-cover object-center h-full w-full"
          style={{
            overflowClipMargin: "unset",
          }}
        />
      )}

      <div className="absolute bottom-0 top-0 right-0 p-2 flex justify-between flex-col items-center">
        <button
          type="button"
          onClick={onClickDelete}
          aria-label="Delete image"
          className="rounded-full bg-neutral-950/5 text-neutral-500 p-2"
        >
          <Trash2Icon size={16} />
        </button>
        {isHideThumbnail ? null : (
          <button
            type="button"
            aria-label={isThumbnail ? "Thumbnail image" : "Set as thumbnail"}
            onClick={!isThumbnail ? onClickThumbnail : undefined}
          >
            <StarIcon
              fill={isThumbnail ? "#5ac7ff" : "none"}
              className="text-lightblue"
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default CarouselImageCard;
