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
import { toast } from "sonner";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbSetDocument } from "@/lib/firebase/actions";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { useAppStore } from "@/lib/store";
import { Checkbox } from "@/components/ui/checkbox";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  minimumDeliveryKilometer: z
    .string()
    .min(1, { message: "Mininum kilometer is required" })
    .regex(/^\d+$/, { message: "Kilometer must be a number" }),
  minimumDeliveryFee: z
    .string()
    .min(1, { message: "Minimum delivery fee is required" })
    .regex(/^\d+$/, { message: "Fee must be a number" }),
  extraKilometer: z
    .string()
    .min(1, { message: "Extra kilometer is required" })
    .regex(/^\d+$/, { message: "Kilometer must be a number" }),
  extraKilometerFee: z
    .string()
    .min(1, { message: "Extra kilometer delivery fee is required" })
    .regex(/^\d+$/, { message: "Fee must be a number" }),
  isShowingOcassion: z.boolean().catch(false), // ✅ ensures it's always boolean
  managerEmail: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function AdminSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentSettings } = useAppStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minimumDeliveryKilometer:
        currentSettings?.minimumDeliveryKilometer?.toString() || "3",
      extraKilometer: currentSettings?.extraKilometer?.toString() || "1",
      minimumDeliveryFee:
        currentSettings?.minimumDeliveryFee?.toString() || "20",
      extraKilometerFee: currentSettings?.extraKilometerFee?.toString() || "10",
      isShowingOcassion: currentSettings?.isShowingOcassion || false,
      managerEmail: currentSettings?.managerEmail || process.env.EMAIL_FROM!,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const res = await dbSetDocument({
        collectionName: DB_COLLECTION.SETTINGS,
        id: "general", // you can change if you want multiple settings docs
        data: {
          ...currentSettings,
          ...values,
          updatedAt: new Date().toISOString(),
        },
      });

      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message || "Failed to save settings");
      } else {
        toast.success("Settings saved successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        {/* Delivery Fee */}
        <FormField
          control={form.control}
          name="minimumDeliveryKilometer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Kilometer</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimumDeliveryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter delivery fee"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extraKilometer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Kilometer</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extraKilometerFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Fee per kilometer</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter fee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="managerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription>
                This email will be the one to receive the order requests.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Is Showing Occasion */}
        <FormField
          control={form.control}
          name="isShowingOcassion"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)} // ✅ force boolean
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Show Occasion</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        {isSubmitting ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Update Settings</Button>
        )}
      </form>
    </Form>
  );
}

export default AdminSettingsForm;
