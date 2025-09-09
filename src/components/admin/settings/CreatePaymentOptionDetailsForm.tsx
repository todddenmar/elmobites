"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { useAppStore } from "@/lib/store";

// --------------------
// Schema
// --------------------

const formSchema = z.object({
  accountName: z
    .string()
    .min(2, { message: "Account name must be at least 2 characters." }),
  accountNumber: z
    .string()
    .min(2, { message: "Account number must be at least 2 characters." }),
  providerName: z.string().min(2, {
    message: "Payment provider name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type CreatePaymentOptionDetailsFormProps = {
  setClose: () => void;
};

function CreatePaymentOptionDetailsForm({
  setClose,
}: CreatePaymentOptionDetailsFormProps) {
  const { currentSettings, setCurrentSettings } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      providerName: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const newOption = {
        id: crypto.randomUUID(),
        ...values,
      };
      const prevOptions = currentSettings.paymentOptions || [];
      const updatedOptions = [...prevOptions, newOption];
      const res = await dbUpdateDocument(DB_COLLECTION.SETTINGS, "general", {
        paymentOptions: updatedOptions,
      });

      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message || "Failed to save settings");
      } else {
        toast.success("Payment option added successfully");
        setCurrentSettings({
          ...currentSettings,
          paymentOptions: updatedOptions,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
    setClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name={`providerName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input placeholder="e.g. GCash, BDO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`accountName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Juan Dela Cruz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`accountNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 09171234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        {isSubmitting ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Save Payment Option</Button>
        )}
      </form>
    </Form>
  );
}

export default CreatePaymentOptionDetailsForm;
