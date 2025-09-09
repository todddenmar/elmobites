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
import { dbSetDocument } from "@/lib/firebase/actions";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";

// --------------------
// Schema
// --------------------

const formSchema = z.object({
  deliveryFee: z
    .number({ error: "Delivery fee must be a number" })
    .min(1, { message: "Delivery fee must be greater than 0" }),
});

type FormValues = z.infer<typeof formSchema>;

function AdminSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryFee: 50,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const res = await dbSetDocument({
        collectionName: DB_COLLECTION.SETTINGS,
        id: "general", // you can change if you want multiple settings docs
        data: {
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
          name="deliveryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter delivery fee"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
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
