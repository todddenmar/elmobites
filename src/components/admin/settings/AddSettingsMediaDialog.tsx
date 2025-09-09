import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TFilePreview, TMediaFile } from "@/typings";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { Button } from "@/components/ui/button";
import { dbUpdateDocument, dbUploadMediaByPath } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import AdminSettingsGalleryForm from "./AdminSettingsGalleryForm";

function AddSettingsMediaDialog() {
  const { currentSettings, setCurrentSettings } = useAppStore();
  const [filesUploaded, setFilesUploaded] = useState<TFilePreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onSaveImages = async () => {
    setIsLoading(true);
    const prevImages = currentSettings?.images || [];
    const savedImages = await Promise.all(
      filesUploaded.map(async (file, idx) => {
        const imageID = crypto.randomUUID();
        const uploadRes = await dbUploadMediaByPath({
          path: `settings/gallery/${imageID}`,
          mediaFile: file,
        });
        if (uploadRes.status === DB_METHOD_STATUS.ERROR) {
          console.log(uploadRes.message);
          return;
        }

        if (uploadRes.data) {
          const downloadURL = uploadRes.data as string;
          const newData: TMediaFile = {
            id: imageID,
            name: file.name,
            type: file.type,
            url: downloadURL,
            isFeatured: true,
            order: prevImages.length + idx + 1,
          };
          return newData;
        }
      })
    );
    const cleanedImages = savedImages.filter((img): img is TMediaFile =>
      Boolean(img)
    );
    const updatedImages = [...prevImages, ...cleanedImages];
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
    toast.success("Images uploaded successfully!");
    setIsLoading(false);
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button">Add More Images</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload more images</DialogTitle>
            <DialogDescription>
              This will add more images for this product.
            </DialogDescription>
          </DialogHeader>
          <AdminSettingsGalleryForm onChange={setFilesUploaded} />
          <div className="flex justify-end">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <Button type="button" onClick={onSaveImages}>
                Save Photos
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddSettingsMediaDialog;
