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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TProduct, TInventory } from "@/typings";
import { dbSetDocument } from "@/lib/firebase/actions";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  productID: z.string().min(1, "Select a product"),
  variantID: z.string().min(1, "Select a variant"),
  branchID: z.string().min(1, "Select a branch"),
  stock: z.number().min(0, "Stock must be 0 or more"),
});

type CreateInventoryFormProps = {
  setClose: () => void;
};

export default function CreateInventoryForm({
  setClose,
}: CreateInventoryFormProps) {
  const {
    userData,
    currentProducts,
    currentStores,
    setCurrentInventory,
    currentInventory,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productID: "", variantID: "", stock: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) {
      toast.error("User not logged in");
      return;
    }

    setIsLoading(true);
    const newInventory: TInventory = {
      id: crypto.randomUUID(),
      productID: values.productID,
      variantID: values.variantID,
      branchID: values.branchID, // ✅ save branch
      stock: values.stock,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.INVENTORY,
      data: newInventory,
      id: newInventory.id,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      toast.error("Error creating inventory");
    } else {
      const updatedInventory = [...currentInventory, newInventory];
      setCurrentInventory(updatedInventory);
      toast.success("Inventory created successfully");
      setClose();
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Select Branch */}
        <FormField
          control={form.control}
          name="branchID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {currentStores?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Product */}
        <FormField
          control={form.control}
          name="productID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedProduct(
                    currentProducts?.find((p) => p.id === val) || null
                  );
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {currentProducts?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Variant */}
        <FormField
          control={form.control}
          name="variantID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.variants?.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} {v.size ? `(${v.size})` : ""} - ₱{v.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
