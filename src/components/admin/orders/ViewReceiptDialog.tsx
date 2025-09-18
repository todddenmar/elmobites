import { TImageReceipt, TPaymentDetails } from "@/typings";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReceiptTextIcon } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
type ViewReceiptDialogProps = {
  paymentData: {
    option: TPaymentDetails;
    referenceNumber: string | null;
    receiptImage: TImageReceipt | null;
  };
};
function ViewReceiptDialog({ paymentData }: ViewReceiptDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const receiptImage = paymentData.receiptImage;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">{paymentData.referenceNumber}</div>
      {receiptImage ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="cursor-pointer">
            <ReceiptTextIcon size={18} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uploaded Receipt</DialogTitle>
              <DialogDescription>
                Reference No. {paymentData.referenceNumber}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] p-4 rounded-lg border">
              {receiptImage?.url ? (
                <Image
                  width={400}
                  height={400}
                  src={receiptImage.url}
                  className="object-contain"
                  alt={"receipt-" + paymentData.referenceNumber}
                />
              ) : null}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

export default ViewReceiptDialog;
