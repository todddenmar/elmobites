"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/custom-ui/typography";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TOrder, TOrderStatus } from "@/typings";
import { convertCurrency } from "@/lib/utils";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// dynamically import map
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  { ssr: false }
);

const STATUS_FLOW: TOrderStatus[] = [
  "PENDING",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

type ViewOrderDialogProps = {
  order: TOrder;
};

export default function ViewOrderDialog({ order }: ViewOrderDialogProps) {
  const { currentActiveOrders, setCurrentActiveOrders } = useAppStore();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TOrderStatus) => {
    if (!order) return;
    setUpdating(true);
    const res = await dbUpdateDocument(DB_COLLECTION.ORDERS, order.id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedOrder = {
        ...order,
        status: newStatus,
      };
      const updatedOrders = currentActiveOrders.map((item) =>
        item.id === order.id ? updatedOrder : item
      );
      setCurrentActiveOrders(updatedOrders || []);
      toast.success("Status updated");
    } else {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <TypographyH4>Order #{order.orderNumber}</TypographyH4>

      <ScrollArea className="h-[450px] pr-2">
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.customer.fullName}
              </p>
              <p>
                <span className="font-medium">Mobile Number:</span>{" "}
                {order.customer.mobileNumber}
              </p>

              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <Badge variant="secondary">{order.status}</Badge>
              </p>
              <p>
                <span className="font-medium">Occasion:</span>{" "}
                {order.occasion || "—"}
              </p>
              <p>
                <span className="font-medium">Total:</span>{" "}
                {convertCurrency(order.totalAmount)}
              </p>
              <p>
                <span className="font-medium">Option:</span>{" "}
                {order.orderType === "DELIVERY" ? "Delivery" : "Pick-up"}
              </p>

              <ScrollArea className="h-[400px] p-4 rounded-lg border">
                {order.payment.receiptImage?.url ? (
                  <Image
                    width={400}
                    height={400}
                    src={order.payment.receiptImage?.url}
                    className="object-contain"
                    alt={"receipt-" + order.payment.referenceNumber}
                  />
                ) : null}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {convertCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Map */}
          {order.orderType === "DELIVERY" && order.coordinates && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-medium">
                    Delivery Location Details:
                  </span>{" "}
                  {order.locationDetails}
                </p>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <MapWithMarker
                    position={[
                      order.coordinates.latitude,
                      order.coordinates.longitude,
                    ]}
                    setPosition={() => {}}
                    isMarkerDraggable={false}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((status) => (
                  <Button
                    key={status}
                    variant={order.status === status ? "default" : "outline"}
                    disabled={updating}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
