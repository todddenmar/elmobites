import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlusIcon } from "lucide-react";
import { TImageReceipt } from "@/typings";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { compressImageToWebP } from "@/lib/utils";
import { dbAddNewReceipt, dbUploadReceipt } from "@/queries/db-create";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { DB_METHOD_STATUS } from "@/lib/config";
import LoadingComponent from "./LoadingComponent";
import { Button } from "../ui/button";
import {
  dbDeleteImageReceipt,
  deleteImageFromStorage,
} from "@/queries/db-delete";
type ReceiptScreenshotUploadProps = {
  value: TImageReceipt | null;
  onChange: (val: TImageReceipt | null) => void;
  emailAddress: string;
  racerID: string;
};
function ReceiptScreenshotUpload({
  value,
  onChange,
  emailAddress,
  racerID,
}: ReceiptScreenshotUploadProps) {
  const { event } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files

    const previewFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    if (previewFiles[0]) {
      if (!event) return;

      const webpFile = await compressImageToWebP(previewFiles[0]);
      if (!webpFile) {
        toast.error("Uploading uncompressed image");
      }
      const newID = crypto.randomUUID();
      setIsLoading(true);
      const resReceipt = await dbUploadReceipt({
        eventID: event.id,
        imageID: newID,
        mediaFile: webpFile || previewFiles[0],
      });
      if (resReceipt.status === DB_METHOD_STATUS.ERROR) {
        toast.error(resReceipt.message);
      }
      if (!resReceipt.data) return;
      const newImageReceipt: TImageReceipt = {
        id: newID,
        url: resReceipt.data,
        racerID: racerID,
        emailAddress: emailAddress,
      };
      const res = await dbAddNewReceipt({
        eventID: event.id,
        imageReceipt: newImageReceipt,
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      toast.success("Receipt Image Uploaded!");
      onChange(newImageReceipt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  const onDelete = async () => {
    if (!value || !event) return;
    setIsLoading(true);
    const resStorage = await deleteImageFromStorage(
      `receipts/${event?.id}/${value.id}`
    );
    if (resStorage?.status === DB_METHOD_STATUS.ERROR) {
      console.log(resStorage.message);
      return;
    }
    const resImage = await dbDeleteImageReceipt({
      eventID: event?.id,
      imageID: value.id,
    });
    if (resImage?.status === DB_METHOD_STATUS.ERROR) {
      console.log(resImage.message);
      return;
    }
    toast.success("Image Deleted");
    onChange(null);
    setIsLoading(false);
  };
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className="space-y-2">
      {value ? (
        <Button
          type="button"
          className="w-full"
          variant={"secondary"}
          onClick={onDelete}
        >
          Delete Image
        </Button>
      ) : (
        <div
          {...getRootProps()}
          className="rounded-lg bg-white/5 border h-[50px] border-dashed p-4 flex flex-col items-center justify-center w-full relative cursor-pointer hover:bg-white/5"
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the files here ...</p> : <ImagePlusIcon />}
        </div>
      )}

      {value?.url && (
        <ScrollArea className="h-[200px] p-4 bg-white/5">
          <div className="flex-1 relative overflow-y-auto">
            <Image
              src={value?.url}
              alt="receipt upload"
              width={400}
              height={800}
              className="object-cover object-center w-full h-full"
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default ReceiptScreenshotUpload;
