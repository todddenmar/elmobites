"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TPaymentDetails } from "@/typings";
import { useAppStore } from "@/lib/store";
import {
  DB_COLLECTION,
  DB_METHOD_STATUS,
  PAYMENT_OPTION,
  PAYMENT_OPTIONS,
} from "@/lib/config";
import { toast } from "sonner";
import Image from "next/image";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { Label } from "@/components/ui/label";
import BankOptionSelect from "@/components/custom-ui/BankOptionSelect";
import ElectronicWalletOptionSelect from "@/components/custom-ui/ElectronicWalletOptionSelect";
import SelectImageFromGallery from "@/components/custom-ui/SelectImageFromGallery";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  accountNumber: z.string().min(2, {
    message: "Account number must be at least 2 characters.",
  }),
});

type UpdatePaymentDetailsFormProps = {
  setClose: () => void;
  paymentDetails: TPaymentDetails;
};
function UpdatePaymentDetailsForm({
  setClose,
  paymentDetails,
}: UpdatePaymentDetailsFormProps) {
  const { currentSettings, setCurrentSettings } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<string>(
    paymentDetails.paymentProvider
  );
  const [qrImageURL, setQrImageURL] = useState<string | null>(
    paymentDetails.qrImageURL || null
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: paymentDetails.accountName,
      accountNumber: paymentDetails.accountNumber,
    },
  });

  const paymentMethodData = PAYMENT_OPTIONS.find(
    (item) => item.id === paymentDetails.paymentMethod
  );

  const methodName = paymentMethodData?.label;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { accountName, accountNumber } = values;
    if (!currentSettings) return;

    setIsLoading(true);

    const updatedOption: TPaymentDetails = {
      ...paymentDetails,
      accountName,
      accountNumber,
      paymentProvider,
      qrImageURL,
    };

    const prevOptions = currentSettings.paymentOptions || [];
    const updatedOptions = prevOptions.map((item) =>
      item.id === paymentDetails.id ? updatedOption : item
    );

    const res = await dbUpdateDocument(DB_COLLECTION.SETTINGS, "general", {
      paymentOptions: updatedOptions,
    });

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedSettings = {
        ...currentSettings,
        paymentOptions: updatedOptions,
      };
      setCurrentSettings(updatedSettings);
      toast.success("Updated Successfully");
    } else {
      console.log({ errorMessage: res.message });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setClose();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account name" {...field} />
                </FormControl>
                <FormDescription>
                  This the name for the {methodName} Account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter ${methodName} number`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your {methodName} account number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {paymentDetails.paymentMethod === PAYMENT_OPTION.BANK_TRANSFER.id && (
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <BankOptionSelect
                value={paymentProvider}
                onChange={setPaymentProvider}
              />
            </div>
          )}
          {paymentDetails.paymentMethod === PAYMENT_OPTION.E_WALLET.id && (
            <div className="space-y-2">
              <Label>E-Wallet Name</Label>
              <ElectronicWalletOptionSelect
                value={paymentProvider}
                onChange={setPaymentProvider}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>QR Image</Label>
            {qrImageURL && (
              <Image
                src={qrImageURL}
                alt={"qr image"}
                className="w-40 h-40 object-cover"
                width={160}
                height={160}
                style={{
                  overflowClipMargin: "unset",
                }}
              />
            )}
            <SelectImageFromGallery
              galleryImages={currentSettings.images || []}
              value={qrImageURL}
              onChange={setQrImageURL}
            />
          </div>
          <SubmitLoadingButtons
            onSubmit={form.handleSubmit(onSubmit)}
            setClose={setClose}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
}

export default UpdatePaymentDetailsForm;
