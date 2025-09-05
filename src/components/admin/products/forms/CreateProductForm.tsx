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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TProduct } from "@/typings";
import { dbCountDocuments, dbSetDocument } from "@/lib/firebase/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import _ from "lodash";

// --------------------
// Schema
// --------------------
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  size: z.string().optional(),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
  description: z.string().optional(),
  tags: z.string().optional(),
  categoryID: z.string().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

type CreateProductFormProps = {
  setClose: () => void;
};

function CreateProductForm({ setClose }: CreateProductFormProps) {
  const {
    userData,
    currentProducts,
    setCurrentProducts,
    currentProductCategories,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // --------------------
  // Form
  // --------------------
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      tags: "",
      categoryID: "",
      variants: [{ name: "Regular", size: "", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // --------------------
  // Submit Handler
  // --------------------

  const countSlugExist = async (slugText: string) => {
    const res = await dbCountDocuments({
      collectionName: DB_COLLECTION.PRODUCTS,
      fieldName: "slug",
      fieldValue: slugText,
      operation: "==",
    });
    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      return res.data as number;
    } else {
      return 0;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, tags, categoryID, variants, slug } = values;
    setIsLoading(true);

    if (!userData) {
      toast.error("User not logged in");
      setIsLoading(false);
      return;
    }

    const totalSlugFound = await countSlugExist(slug);
    if (totalSlugFound > 0) {
      toast.error("Slug already exist, please change");
      return;
    }

    const formattedVariants = variants.map((variant) => ({
      id: crypto.randomUUID(),
      name: variant.name,
      size: variant.size || "",
      price: variant.price,
    }));

    const newProduct: TProduct = {
      id: crypto.randomUUID(),
      name,
      slug,
      description: description || "",
      thumbnailImage: "",
      images: [],
      price: formattedVariants[0]?.price ?? 0,
      tags: tags || "",
      categoryID: categoryID === "none" ? null : categoryID,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      variants: formattedVariants,
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.PRODUCTS,
      data: newProduct,
      id: newProduct.id,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log({ errorMessage: res.message });
      toast.error("Error creating product");
      setIsLoading(false);
      return;
    }

    const updatedProducts = [...(currentProducts || []), newProduct];
    setCurrentProducts(updatedProducts);
    setIsLoading(false);
    setClose();
    toast.success("Product created successfully");
  }
  const watchName = form.watch("name");
  useEffect(() => {
    form.setValue("slug", _.kebabCase(watchName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchName]);
  // --------------------
  // Render
  // --------------------
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="overflow-y-auto h-[500px] md:h-fit px-2">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-2">
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
                      <Textarea
                        placeholder="Tell us a little bit about the product"
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
                      <Input placeholder="e.g. new, bestseller" {...field} />
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
                          <FormLabel className="block md:hidden">
                            Name
                          </FormLabel>
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
                          <FormLabel className="block md:hidden">
                            Size
                          </FormLabel>
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
                          <FormLabel className="block md:hidden">
                            Price
                          </FormLabel>
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

export default CreateProductForm;
