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
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import _ from "lodash";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TStore } from "@/typings";
import { dbCountDocuments, dbSetDocument } from "@/lib/firebase/actions";
import { Label } from "@/components/ui/label";
import { isValid, parse } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
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
});
type CreateStoreFormProps = {
  setClose: () => void;
};
function CreateStoreForm({ setClose }: CreateStoreFormProps) {
  const { userData, currentStores, setCurrentStores } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [openingTime, setOpeningTime] = useState<string>("");
  const [closingTime, setClosingTime] = useState<string>("");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      slug: "",
      coordinates: "",
    },
  });

  // 2. Define a submit handler.

  const countSlugExist = async (slugText: string) => {
    const res = await dbCountDocuments({
      collectionName: DB_COLLECTION.STORES,
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { name, description, location, slug, coordinates } = values;
    setIsLoading(true);
    if (!userData) {
      return;
    }
    const totalSlugFound = await countSlugExist(slug);
    if (totalSlugFound > 0) {
      toast.error("Slug already exist, please change");
      return;
    }
    if (openingTime || closingTime) {
      const parsedStartTime = parse(openingTime, "HH:mm", new Date());
      const parsedEndTime = parse(closingTime, "HH:mm", new Date());
      if (!isValid(parsedStartTime) || !isValid(parsedEndTime)) {
        toast.error(
          "Invalid Daily Time Format, must be HH:mm military time / 24hrs"
        );
        return;
      }
    }
    const newStore: TStore = {
      id: crypto.randomUUID(),
      slug,
      name,
      description: description || "",
      location,
      isActive: true,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      coordinates: coordinates,
      images: [],
      thumbnailImage: null,
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.STORES,
      data: newStore,
      id: newStore.id,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log({ errorMessage: res.message });
      return;
    }
    const updatedStores = [...currentStores, newStore];
    setCurrentStores(updatedStores);
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
          <div className=" overflow-y-auto h-[500px] md:h-fit px-2">
            <div className="space-y-4">
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
                      <Input
                        placeholder="Enter address or building"
                        {...field}
                      />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Daily Opening Time</Label>
                  <Input
                    placeholder="00:00"
                    value={openingTime}
                    onChange={(val) => setOpeningTime(val.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily Closing Time</Label>
                  <Input
                    placeholder="23:59"
                    value={closingTime}
                    onChange={(val) => setClosingTime(val.target.value)}
                  />
                </div>
              </div>

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

export default CreateStoreForm;
