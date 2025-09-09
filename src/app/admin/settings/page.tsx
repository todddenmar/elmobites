"use client";
import AddSettingsMediaDialog from "@/components/admin/settings/AddSettingsMediaDialog";
import AdminSettingsForm from "@/components/admin/settings/AdminSettingsForm";
import CarouselImageCard from "@/components/custom-ui/CarouselImageCard";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { TypographyH4 } from "@/components/custom-ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { TMediaFile } from "@/typings";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import AddPaymentOptionButton from "@/components/admin/settings/AddPaymentOptionButton";
function AdminSettingsPage() {
  const { currentSettings, setCurrentSettings } = useAppStore();

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<TMediaFile | null>(null);

  const onDeleteImage = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    const prevImages = currentSettings.images || [];
    const updatedImages = prevImages.filter(
      (item) => item.id != selectedImage.id
    );

    const res = await dbUpdateDocument(DB_COLLECTION.SETTINGS, "general", {
      images: updatedImages,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    const updatedSettings = {
      ...currentSettings,
      images: updatedImages,
    };
    setCurrentSettings(updatedSettings);
    setIsOpenConfirm(false);
    setIsLoading(false);
    toast.success("Image deleted");
  };

  return (
    <div className="flex flex-col gap-4 flex-1 h-full">
      <div className="flex justify-between items-center gap-2">
        <SectionTitle>Settings</SectionTitle>
        <AddSettingsMediaDialog />
      </div>
      <AdminSettingsForm />

      <div className="space-y-2">
        <TypographyH4>Payment Options</TypographyH4>
        <div className="space-y-2">
          {currentSettings.paymentOptions?.map((item) => {
            return (
              <div key={`payment-option-item-${item.accountNumber}`}>
                <div>{item.accountName}</div>
                <div>{item.accountNumber}</div>
                <div>{item.providerName}</div>
              </div>
            );
          })}
        </div>
        <AddPaymentOptionButton />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <TypographyH4>Gallery</TypographyH4>
        {currentSettings.images?.length === 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
          </div>
        ) : null}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {currentSettings.images
            ?.map((item, idx) => {
              const key = `prev-image-${idx}`;
              const url = item.url;
              return (
                <div key={key}>
                  <CarouselImageCard
                    onClickDelete={() => {
                      setSelectedImage(item);
                      setIsOpenConfirm(true);
                    }}
                    onClickThumbnail={() => {
                      console.log("image clicked");
                    }}
                    onClickImage={() => {
                      console.log("image clicked");
                    }}
                    isThumbnail={false}
                    isHideThumbnail
                    alt={key}
                    src={url}
                  />
                </div>
              );
            })
            .reverse()}
        </div>
      </div>

      <Dialog open={isOpenConfirm} onOpenChange={setIsOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              image.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setIsOpenConfirm(false)}
                type="button"
                variant={"destructive"}
              >
                Cancel
              </Button>
              <Button onClick={onDeleteImage} type="button">
                Confirm
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminSettingsPage;
