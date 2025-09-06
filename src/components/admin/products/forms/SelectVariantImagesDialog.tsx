import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TMediaFile, TProduct, TProductVariant } from "@/typings";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { Button } from "@/components/ui/button";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import Image from "next/image";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import { cn } from "@/lib/utils";
import { LoaderIcon, StarIcon } from "lucide-react";
type SelectVariantImagesDialogProps = {
  product: TProduct;
  variant: TProductVariant;
};
function SelectVariantImagesDialog({
  product,
  variant,
}: SelectVariantImagesDialogProps) {
  const { currentProducts, setCurrentProducts } = useAppStore();
  const productImages: TMediaFile[] = product.images || [];
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedImages(variant.imageURLs || []);
  }, [variant]);

  const onChangeThumbnail = async (url: string) => {
    setIsLoadingThumbnail(true);
    const updatedVariant: TProductVariant = {
      ...variant,
      thumbnailImage: url,
    };
    const productVariants = product.variants;
    const updatedVariants = productVariants.map((item) =>
      item.id === variant.id ? updatedVariant : item
    );
    const res = await dbUpdateDocument(DB_COLLECTION.PRODUCTS, product.id, {
      variants: updatedVariants,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      setIsLoading(false);
      return;
    }

    const updatedProduct = {
      ...product,
      variants: updatedVariants,
    };

    const updatedProducts = currentProducts.map((item) =>
      item.id === product.id ? updatedProduct : item
    );
    setCurrentProducts(updatedProducts);
    setIsLoadingThumbnail(false);
    toast.success("Thumbnail changed successfully!");
  };

  const onSaveImages = async () => {
    setIsLoading(true);
    const updatedVariant: TProductVariant = {
      ...variant,
      imageURLs: selectedImages,
    };
    const productVariants = product.variants;
    const updatedVariants = productVariants.map((item) =>
      item.id === variant.id ? updatedVariant : item
    );
    const res = await dbUpdateDocument(DB_COLLECTION.PRODUCTS, product.id, {
      variants: updatedVariants,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      setIsLoading(false);
      return;
    }

    const updatedProduct = {
      ...product,
      variants: updatedVariants,
    };

    const updatedProducts = currentProducts.map((item) =>
      item.id === product.id ? updatedProduct : item
    );
    setCurrentProducts(updatedProducts);

    toast.success("Images uploaded successfully!");
    setIsLoading(false);
    setIsOpen(false);
  };

  const onSelectImage = (imageURL: string) => {
    const updatedItems = [...selectedImages, imageURL];
    setSelectedImages(updatedItems);
  };
  const onRemoveImage = (imageURL: string) => {
    const updatedItems = selectedImages.filter((item) => item != imageURL);
    setSelectedImages(updatedItems);
  };
  return (
    <div className="space-y-4">
      {selectedImages.length > 0 ? (
        <div className="flex items-center gap-4">
          {selectedImages?.map((item, idx) => {
            const isThumbnail = item === variant.thumbnailImage;
            return (
              <div
                key={`variant-image-${idx}`}
                className={cn(
                  "rounded-lg relative overflow-hidden aspect-square"
                )}
              >
                <Image
                  src={item}
                  width={100}
                  height={100}
                  className="object-cover object-center h-full w-full"
                  alt={`${variant.name}-image-${idx}`}
                />
                {isLoadingThumbnail ? (
                  <div className="abolute bottom-2 right-2 z-10">
                    <LoaderIcon className="animate-spin" />
                  </div>
                ) : (
                  <Button
                    type="button"
                    size={"icon"}
                    className="cursor-pointer absolute bottom-2 right-2 z-10"
                    aria-label={
                      isThumbnail ? "Thumbnail image" : "Set as thumbnail"
                    }
                    onClick={() => onChangeThumbnail(item)}
                  >
                    <StarIcon
                      fill={isThumbnail ? "#fff" : "none"}
                      className="text-lightblue"
                    />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyLayout>No Images Selected</EmptyLayout>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button">Select Images</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecting images</DialogTitle>
            <DialogDescription>
              This will add images for this variant ({variant.name}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((item) => {
              const isSelected = selectedImages.includes(item.url);
              return (
                <div
                  key={`select-image-${item.id}`}
                  onClick={() =>
                    isSelected
                      ? onRemoveImage(item.url)
                      : onSelectImage(item.url)
                  }
                  className={cn(
                    "rounded-lg overflow-hidden w-full aspect-square cursor-pointer",
                    isSelected ? "border-2 border-black" : ""
                  )}
                >
                  <Image
                    src={item.url}
                    width={100}
                    height={100}
                    className="object-cover object-center h-full w-full"
                    alt={item.name}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <Button type="button" onClick={onSaveImages}>
                Save
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SelectVariantImagesDialog;
