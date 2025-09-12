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
import { TPaymentDetails, TPaymentMethod } from "@/typings";
import { useAppStore } from "@/lib/store";
import {
  DB_COLLECTION,
  DB_METHOD_STATUS,
  PAYMENT_OPTION,
  PAYMENT_OPTIONS,
} from "@/lib/config";
import { toast } from "sonner";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import BankOptionSelect from "@/components/custom-ui/BankOptionSelect";
import { Label } from "@/components/ui/label";
import ElectronicWalletOptionSelect from "@/components/custom-ui/ElectronicWalletOptionSelect";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  accountNumber: z.string().min(2, {
    message: "Account number must be at least 2 characters.",
  }),
});

type AddPaymentDetailsFormProps = {
  setClose: () => void;
  paymentMethod: TPaymentMethod;
};
function AddPaymentDetailsForm({
  setClose,
  paymentMethod,
}: AddPaymentDetailsFormProps) {
  const { currentSettings, setCurrentSettings } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<string>(
    paymentMethod === PAYMENT_OPTION.E_WALLET.id ? "GCash" : ""
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
    },
  });

  const paymentMethodData = PAYMENT_OPTIONS.find(
    (item) => item.id === paymentMethod
  );

  const methodName = paymentMethodData?.label;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { accountName, accountNumber } = values;
    setIsLoading(true);

    const newPaymentOption: TPaymentDetails = {
      id: crypto.randomUUID(),
      accountName,
      accountNumber,
      paymentMethod,
      paymentProvider,
    };

    const prevOptions = currentSettings.paymentOptions || [];
    const updatedOptions = [...prevOptions, newPaymentOption];

    const res = await dbUpdateDocument(DB_COLLECTION.SETTINGS, "general", {
      paymentOptions: updatedOptions,
    });

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedSettings = {
        ...currentSettings,
        paymentOptions: updatedOptions,
      };
      setCurrentSettings(updatedSettings);
      toast.success("Added Successfully");
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

          {paymentMethod === PAYMENT_OPTION.BANK_TRANSFER.id && (
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <BankOptionSelect
                value={paymentProvider}
                onChange={setPaymentProvider}
              />
            </div>
          )}
          {paymentMethod === PAYMENT_OPTION.E_WALLET.id && (
            <div className="space-y-2">
              <Label>E-Wallet Name</Label>
              <ElectronicWalletOptionSelect
                value={paymentProvider}
                onChange={setPaymentProvider}
              />
            </div>
          )}

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

export default AddPaymentDetailsForm;
