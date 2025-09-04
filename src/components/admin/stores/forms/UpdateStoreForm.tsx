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
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TStore } from "@/typings";
import { dbSetDocument } from "@/lib/firebase/actions";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";
import { parse, isValid } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  coordinates: z
    .string({ error: "Coordinates are required" })
    .regex(/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, {
      message: "Coordinates must be in 'lat, lng' format",
    }),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Opening time must be in HH:mm (24-hour) format",
  }),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Closing time must be in HH:mm (24-hour) format",
  }),
});

type UpdateStoreFormProps = {
  setClose: () => void;
  store: TStore; // pass the existing store to edit
};

function UpdateStoreForm({ setClose, store }: UpdateStoreFormProps) {
  const { currentStores, setCurrentStores } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ prefill with existing store values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store?.name || "",
      description: store?.description || "",
      location: store?.location || "",
      slug: store?.slug || "",
      coordinates: store?.coordinates || "",
      openingTime: store?.openingTime || "08:00",
      closingTime: store?.closingTime || "21:00",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      name,
      description,
      location,
      slug,
      coordinates,
      openingTime,
      closingTime,
    } = values;

    setIsLoading(true);

    if (openingTime || closingTime) {
      const parsedStartTime = parse(openingTime, "HH:mm", new Date());
      const parsedEndTime = parse(closingTime, "HH:mm", new Date());
      if (!isValid(parsedStartTime) || !isValid(parsedEndTime)) {
        toast.error("Invalid Daily Time Format, must be HH:mm (24hr)");
        return;
      }
    }

    const updatedStore: TStore = {
      ...store, // keep old data like id, createdAt, etc.
      name,
      description: description || "",
      location,
      slug,
      coordinates,
      openingTime,
      closingTime,
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.STORES,
      data: updatedStore,
      id: store.id, // update instead of creating new
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      toast.error("Failed to update store");
      console.log({ errorMessage: res.message });
      return;
    }

    // update local store list
    const updatedStores = currentStores.map((s) =>
      s.id === store.id ? updatedStore : s
    );
    setCurrentStores(updatedStores);

    toast.success("Store updated successfully!");
    setIsLoading(false);
    setClose();
  }

  const watchName = form.watch("name");
  useEffect(() => {
    form.setValue("slug", _.kebabCase(watchName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchName]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="overflow-y-auto h-[500px] md:h-fit px-2 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Branch" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your store&apos;s display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="store-name" {...field} />
                  </FormControl>
                  <FormDescription>UID / slug.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address or building" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinates</FormLabel>
                  <FormControl>
                    <Input placeholder="latitude, longitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Opening Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Closing Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the store"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default UpdateStoreForm;
