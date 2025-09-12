import { TPaymentDetails } from "@/typings";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CopyIcon, EditIcon, QrCodeIcon } from "lucide-react";
import { toast } from "sonner";
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
  return (
    <div className="p-2 bg-white/5 rounded-lg items-center flex gap-2">
      <div className="flex-1 ">
        <div className="font-semibold text-muted-foreground">
          {paymentDetails.paymentProvider}
        </div>
        <div className="text-sm">{paymentDetails.accountName}</div>
        <div className="text-muted-foreground text-sm">
          {paymentDetails.accountNumber}
        </div>
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
          size={"icon"}
          variant={"secondary"}
          onClick={() => {
            navigator.clipboard.writeText(paymentDetails.accountNumber || "");
            toast.success("Account number copied to clipboard");
          }}
        >
          <CopyIcon />
        </Button>
      )}
    </div>
  );
}

export default PaymentDetailsItem;
