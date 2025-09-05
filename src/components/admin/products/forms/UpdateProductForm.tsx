"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TProduct, TProductVariant } from "@/typings";
import { dbSetDocument } from "@/lib/firebase/actions";
import _ from "lodash";

// --------------------
// Schema
// --------------------
const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  size: z.string().optional(),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
  tags: z.string().optional(),
  categoryID: z.string().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

type UpdateProductFormProps = {
  product: TProduct;
  setClose: () => void;
};

export default function UpdateProductForm({
  product,
  setClose,
}: UpdateProductFormProps) {
  const {
    userData,
    currentProducts,
    setCurrentProducts,
    currentProductCategories,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      slug: product?.slug || "",
      description: product.description,
      tags: product.tags,
      categoryID: product.categoryID || "none",
      variants: product.variants.map((v) => ({ ...v })), // preserve IDs
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) {
      toast.error("User not logged in");
      return;
    }

    setIsLoading(true);

    try {
      const formattedVariants: TProductVariant[] = values.variants.map((v) => ({
        id: v.id || crypto.randomUUID(),
        name: v.name,
        size: v.size || "",
        price: v.price,
      }));

      const updatedProduct: TProduct = {
        ...product,
        name: values.name,
        slug: values.slug,
        description: values.description || "",
        tags: values.tags || "",
        categoryID: values.categoryID === "none" ? null : product.categoryID,
        price: formattedVariants[0]?.price ?? product.price,
        variants: formattedVariants,
        timestamp: serverTimestamp(),
      };

      const res = await dbSetDocument({
        collectionName: DB_COLLECTION.PRODUCTS,
        data: updatedProduct,
        id: product.id,
      });

      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        toast.error("Error updating product");
      } else {
        const updatedProducts = (currentProducts || []).map((p) =>
          p.id === product.id ? updatedProduct : p
        );
        setCurrentProducts(updatedProducts);
        toast.success("Product updated successfully");
        setClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  const watchName = form.watch("name");
  useEffect(() => {
    form.setValue("slug", _.kebabCase(watchName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchName]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="overflow-y-auto h-[500px] md:h-fit px-2 space-y-4">
          <div className="flex gap-2">
            {/* Product Name */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Option for no category */}
                        <SelectItem value="none">None</SelectItem>
                        {currentProductCategories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. product-name" />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Product description" />
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
                  <Input {...field} placeholder="e.g. new, bestseller" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Variants */}
          <div className="space-y-2">
            <FormLabel>Variants</FormLabel>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid md:flex items-center gap-2 border p-2 rounded-lg"
              >
                {/* Variant Name */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block md:hidden">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Variant Size */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem className="w-full md:w-32">
                      <FormLabel className="block md:hidden">Size</FormLabel>
                      <FormControl>
                        <Input placeholder="Size" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Variant Price */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="w-full md:w-32">
                      <FormLabel className="block md:hidden">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          placeholder="Amount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ name: "", size: "", price: 0 })}
              variant="secondary"
            >
              + Add Variant
            </Button>
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
  );
}
