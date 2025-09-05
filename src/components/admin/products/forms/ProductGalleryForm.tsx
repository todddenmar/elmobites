"use client";
import React, { useEffect, useState } from "react";
import { TMediaFile, TFilePreview } from "@/typings";
import { Skeleton } from "@/components/ui/skeleton";
import CarouselImageCard from "@/components/custom-ui/CarouselImageCard";
import ProductMediaDropzone from "../ProductMediaDropzone";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
type ProductGalleryFormProps = {
  previousImages?: TMediaFile[];
  onChange: (val: TFilePreview[]) => void;
};
function ProductGalleryForm({
  previousImages,
  onChange,
}: ProductGalleryFormProps) {
  const [filesUploaded, setFilesUploaded] = useState<TFilePreview[]>([]);
  const [prevImages, setPrevImages] = useState<TMediaFile[]>([]);
  const onUpload = (val: TFilePreview[]) => {
    setFilesUploaded((prevFiles) => [...prevFiles, ...val]);
  };
  useEffect(() => {
    onChange(filesUploaded);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesUploaded]);

  useEffect(() => {
    setPrevImages(previousImages || []);
  }, [previousImages]);

  const onRemove = (toRemove: TFilePreview) => {
    const updated = filesUploaded.filter((item) => item != toRemove);
    setFilesUploaded(updated);
  };

  const totalPrevious = prevImages?.length || 0;
  const totalUploads = totalPrevious + filesUploaded.length;
  return (
    <>
      <div className="relative">
        {totalUploads < 3 && (
          <div className="absolute bottom-2 left-2 z-10">
            <ProductMediaDropzone
              onUpload={onUpload}
              uploadedCount={totalUploads}
            />
          </div>
        )}
        {totalUploads === 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="col-span-2 w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
          </div>
        )}
        <Carousel className="flex-1">
          <CarouselContent className="w-full">
            {filesUploaded
              ?.map((item, idx) => {
                const key = `image-${idx}`;
                const url = item.preview;
                return (
                  <CarouselItem key={key} className="basis-2/3 relative">
                    <CarouselImageCard
                      isHideThumbnail
                      onClickDelete={() => {
                        onRemove(item);
                      }}
                      onClickThumbnail={() => {
                        console.log("thumbnail clicked");
                      }}
                      onClickImage={() => {
                        console.log("image clicked");
                      }}
                      isThumbnail={false}
                      alt={key}
                      src={url}
                    />
                  </CarouselItem>
                );
              })
              .reverse()}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}

export default ProductGalleryForm;
