"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { TOrder, TOrderLog, TOrderTableItem } from "@/typings";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// ✅ Zod Schema
const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
  paymentStatus: z.enum(["PAID", "UNPAID", "REFUNDED"]),
  isFulfilled: z.boolean(),
});

type OrderStatusFormValues = z.infer<typeof orderStatusSchema>;

type OrderStatusFormProps = {
  orderData: TOrder;
};
function OrderStatusForm({ orderData }: OrderStatusFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      status: orderData.status || "PENDING",
      paymentStatus: orderData.paymentStatus || "UNPAID",
      isFulfilled: orderData.isFulfilled || false,
    },
  });

  const onSubmit = async (data: OrderStatusFormValues) => {
    setIsLoading(true);

    const updatedLogs: TOrderLog[] = [...(orderData.logs || [])];

    const lastLog = updatedLogs[updatedLogs.length - 1];
    const now = new Date().toISOString();

    if (lastLog && lastLog.status === data.status) {
      // ✅ Same status → update the timestamp only
      updatedLogs[updatedLogs.length - 1] = {
        ...lastLog,
        changedAt: now,
      };
    } else {
      // ✅ New status → append a new log
      updatedLogs.push({
        status: data.status,
        changedAt: now,
      });
    }

    const res = await dbUpdateDocument(DB_COLLECTION.ORDERS, orderData.id, {
      ...data,
      logs: updatedLogs,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      setIsLoading(false);
      return;
    }

    toast.success("Order status updated");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Order Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    "PENDING",
                    "CONFIRMED",
                    "PREPARING",
                    "READY_FOR_PICKUP",
                    "OUT_FOR_DELIVERY",
                    "COMPLETED",
                    "CANCELLED",
                  ].map((status) => (
                    <FormItem
                      key={status}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={status} />
                      </FormControl>
                      <FormLabel className="font-normal">{status}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Status */}
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  {["PAID", "UNPAID", "REFUNDED"].map((status) => (
                    <FormItem
                      key={status}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={status} />
                      </FormControl>
                      <FormLabel className="font-normal">{status}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fulfilled */}
        <FormField
          control={form.control}
          name="isFulfilled"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fulfillment</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">Unfulfilled</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Fulfilled</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logs List */}
        <div className="space-y-2">
          <FormLabel>Status History</FormLabel>
          <ul className="space-y-2 border rounded-md p-3 bg-white/5">
            {(orderData.logs || []).map((log, i) => {
              const statusConfig: Record<
                TOrderTableItem["status"],
                { label: string; className: string }
              > = {
                PENDING: {
                  label: "Pending",
                  className: "bg-gray-500 text-white",
                },
                CONFIRMED: {
                  label: "Confirmed",
                  className: "bg-blue-500 text-white",
                },
                PREPARING: {
                  label: "Preparing",
                  className: "bg-yellow-500 text-white",
                },
                READY_FOR_PICKUP: {
                  label: "Ready for Pickup",
                  className: "bg-indigo-500 text-white",
                },
                OUT_FOR_DELIVERY: {
                  label: "Out for Delivery",
                  className: "bg-purple-500 text-white",
                },
                COMPLETED: {
                  label: "Completed",
                  className: "bg-green-600 text-white",
                },
                CANCELLED: {
                  label: "Cancelled",
                  className: "bg-red-600 text-white",
                },
              };

              const { label, className } =
                statusConfig[log.status as keyof typeof statusConfig];

              return (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                >
                  <Badge className={className}>{label}</Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(log.changedAt).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-end">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <Button type="submit">Save</Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default OrderStatusForm;
