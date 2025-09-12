import { TPaymentDetails } from "@/typings";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { DownloadIcon, EditIcon, QrCodeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
type PaymentDetailsItemProps = {
  paymentDetails: TPaymentDetails;
  onEdit?: () => void;
};
function PaymentDetailsItem({
  paymentDetails,
  onEdit,
}: PaymentDetailsItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDownload = () => {
    if (!paymentDetails.qrImageURL) return;
    const link = document.createElement("a");
    link.href = paymentDetails.qrImageURL;
    link.download = `${paymentDetails.accountName}-qr.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="p-2 bg-black text-white rounded-lg items-center flex gap-2">
      <div className="flex-1 ">
        <div className="font-semibold">{paymentDetails.paymentProvider}</div>
        <div className="text-sm">{paymentDetails.accountName}</div>
      </div>
      {paymentDetails.qrImageURL && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              variant={"secondary"}
              size={"icon"}
            >
              <QrCodeIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR Code for payment.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[600px] overflow-y-auto">
              <Image
                src={paymentDetails.qrImageURL}
                alt={`${paymentDetails.accountName}-qr`}
                className="object-cover"
                width={800}
                height={800}
                style={{
                  overflowClipMargin: "unset",
                }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {onEdit ? (
        <Button
          type="button"
          onClick={onEdit}
          variant={"secondary"}
          size={"icon"}
        >
          <EditIcon />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleDownload}
          variant={"secondary"}
          size={"icon"}
        >
          <DownloadIcon />
        </Button>
      )}
    </div>
  );
}

export default PaymentDetailsItem;
