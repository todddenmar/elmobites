import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TFilePreview } from "@/typings";
import { ImagePlusIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type ProductMediaDropzoneProps = {
  onUpload: (val: TFilePreview[]) => void;
  uploadedCount: number;
};
function ProductMediaDropzone({
  onUpload,
  uploadedCount,
}: ProductMediaDropzoneProps) {
  const isDisabled = uploadedCount >= 3;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isDisabled) return;
      const previewFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      onUpload(previewFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDisabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isDisabled,
    maxFiles: 3 - uploadedCount,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
      "image/jfif": [],
      "image/avif": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "rounded-lg p-0 flex flex-col text-lightblue items-center justify-center cursor-pointer hover:bg-white/5/5",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        uploadedCount === 0 ? "w-full h-[36px]" : "w-[50px] h-full"
      )}
    >
      <input
        {...getInputProps()}
        multiple
        disabled={isDisabled}
        max={3 - uploadedCount}
      />
      {isDisabled ? (
        <p className="text-xs text-center text-darkgrey">Max 3 images</p>
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <Button
          type="button"
          size="icon"
          className="shadow-lg rounded-full p-2 flex flex-col items-center justify-center"
        >
          <ImagePlusIcon />
        </Button>
      )}
    </div>
  );
}

export default ProductMediaDropzone;
