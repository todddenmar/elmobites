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
import { dbSetDocument } from "@/lib/firebase/actions";
import { TProductCategory } from "@/typings";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type CreateProductCategoryFormProps = {
  setClose: () => void;
};

function CreateProductCategoryForm({
  setClose,
}: CreateProductCategoryFormProps) {
  const { userData, currentProductCategories, setCurrentProductCategories } =
    useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // --------------------
  // Form
  // --------------------
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: "",
    },
  });

  // --------------------
  // Submit Handler
  // --------------------
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, tags } = values;
    setIsLoading(true);

    if (!userData) {
      toast.error("User not logged in");
      setIsLoading(false);
      return;
    }

    const newCategory: TProductCategory = {
      id: crypto.randomUUID(),
      name,
      description: description || "",
      tags: tags || "",
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.PRODUCT_CATEGORIES,
      data: newCategory,
      id: newCategory.id,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log({ errorMessage: res.message });
      toast.error("Error creating category");
      setIsLoading(false);
      return;
    }

    const updatedCategories = [
      ...(currentProductCategories || []),
      newCategory,
    ];
    setCurrentProductCategories(updatedCategories);
    setIsLoading(false);
    setClose();
    toast.success("Category created successfully");
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
                        placeholder="e.g. salad, sweets, etc."
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

export default CreateProductCategoryForm;
