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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbSetDocument } from "@/lib/firebase/actions";
import { TPosition, TSettings } from "@/typings";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { useAppStore } from "@/lib/store";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  name: z.string().min(2, { message: "Position name is required" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreatePositionFormProps = {
  setClose: () => void;
};
function CreatePositionForm({ setClose }: CreatePositionFormProps) {
  const { currentSettings, setCurrentSettings } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const newPosition: TPosition = {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const prevPositions = currentSettings.employeePositions || [];
      const updatedPositions = [...prevPositions, newPosition];

      const res = await dbSetDocument({
        collectionName: DB_COLLECTION.SETTINGS,
        id: "general", // you can change if you want multiple settings docs
        data: {
          ...currentSettings,
          employeePositions: updatedPositions,
          updatedAt: new Date().toISOString(),
        },
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message || "Failed to create position");
      } else {
        const updatedSettings: TSettings = {
          ...currentSettings,
          employeePositions: updatedPositions,
        };
        setCurrentSettings(updatedSettings);
        toast.success("Position created successfully!");
        form.reset();
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
        className="space-y-6 max-w-md"
      >
        {/* Position Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Trainer, Cashier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Short description of the role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        {isSubmitting ? (
          <LoadingComponent />
        ) : (
          <Button type="submit" className="w-full">
            Create Position
          </Button>
        )}
      </form>
    </Form>
  );
}

export default CreatePositionForm;
