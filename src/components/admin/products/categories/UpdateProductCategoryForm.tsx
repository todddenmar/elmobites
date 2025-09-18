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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { TProductCategory } from "@/typings";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type UpdateProductCategoryFormProps = {
  setClose: () => void;
  category: TProductCategory;
};

function UpdateProductCategoryForm({
  setClose,
  category,
}: UpdateProductCategoryFormProps) {
  const { currentProductCategories, setCurrentProductCategories } =
    useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // --------------------
  // Form
  // --------------------
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      tags: category.tags || "",
    },
  });

  // --------------------
  // Submit Handler
  // --------------------
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const updates = {
      name: values.name,
      description: values.description || "",
      tags: values.tags || "",
    };
    const updatedCategory: TProductCategory = {
      ...category,
      ...updates,
    };

    const res = await dbUpdateDocument(
      DB_COLLECTION.PRODUCT_CATEGORIES,
      updatedCategory.id,
      updates
    );

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log({ errorMessage: res.message });
      toast.error("Error updating category");
      setIsLoading(false);
      return;
    }

    // Replace updated category in state
    const updatedCategories = (currentProductCategories || []).map((c) =>
      c.id === updatedCategory.id ? updatedCategory : c
    );
    setCurrentProductCategories(updatedCategories);
    setIsLoading(false);
    setClose();
    toast.success("Category updated successfully");
  }

  // --------------------
  // Render
  // --------------------
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="overflow-y-auto h-[500px] md:h-fit px-2">
            <div className="space-y-4">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the product category&apos;s display name.
                    </FormDescription>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the category"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. cake, cheese cake, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitLoadingButtons
              onSubmit={form.handleSubmit(onSubmit)}
              setClose={setClose}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UpdateProductCategoryForm;
