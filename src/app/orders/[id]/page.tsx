"use client";

import { TypographyH4 } from "@/components/custom-ui/typography";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TOrder, TOrderItem } from "@/typings";
import { dbFetchDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import dynamic from "next/dynamic";
import { convertCurrency } from "@/lib/utils";
import Image from "next/image";
import { useAppStore } from "@/lib/store";

// dynamically import map
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  { ssr: false }
);

async function fetchOrderById(id: string): Promise<TOrder | null> {
  const res = await dbFetchDocument(DB_COLLECTION.ORDERS, id);
  if (res.status === DB_METHOD_STATUS.ERROR) {
    console.log(res.message);
    return null;
  }
  if (res.data) {
    return res.data as TOrder;
  }
  return null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<TOrder | null>(null);
  const { currentStores, currentSettings } = useAppStore();
  const DELIVERY_FEE = currentSettings.deliveryFee;
  useEffect(() => {
    if (orderId) fetchOrderById(orderId).then(setOrder);
  }, [orderId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, DB_COLLECTION.ORDERS, orderId),
      (docItem) => {
        const orderResult = docItem.data() as TOrder;
        if (orderResult) setOrder(orderResult);
      }
    );
    return () => unsubscribe();
  }, [orderId]);

  if (!order) {
    return <p className="p-6">Loading order...</p>;
  }

  return (
    <div className="p-4 space-y-6 max-w-7xl w-full mx-auto">
      {/* Back Button */}
      <Button
        variant="outline"
        type="button"
        onClick={() => router.push("/orders")}
      >
        <ArrowLeftIcon /> Back to My Orders
      </Button>
      <TypographyH4>Order #{order.id}</TypographyH4>

      {/* Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Order Info */}
        <div className="flex-1 space-y-6 border p-4 rounded-lg h-fit">
          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span>{order.status}</span>
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Order Type:</span> {order.orderType}
            </p>
          </div>

          {/* Map if Delivery */}
          {order.orderType === "DELIVERY" && order.coordinates && (
            <div className="space-y-4">
              <TypographyH4>Delivery Location</TypographyH4>
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
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 border-t pt-4">
            <TypographyH4>Items</TypographyH4>
            {order.items.map((item: TOrderItem) => {
              const store = currentStores.find((s) => s.id === item.branchID);
              return (
                <div
                  key={`order-item${item.id}`}
                  className="flex justify-between items-center border-b py-2 relative"
                >
                  <div className="flex flex-col w-full">
                    <span className="text-xs">{store?.name}</span>
                    <span className="font-medium">{item.productName}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.variantName} x {item.quantity}
                    </span>
                  </div>
                  <div className="text-right">
                    {convertCurrency(item.subtotal)}
                  </div>
                </div>
              );
            })}
          </div>

          {order.orderType === "DELIVERY" && (
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>{convertCurrency(DELIVERY_FEE)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg border-t pt-4">
            <span>Total</span>
            <span>₱{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* RIGHT: Customer + Payment */}
        <div className="space-y-6 lg:max-w-sm w-full">
          {/* Customer Details */}
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            <TypographyH4>Customer Details</TypographyH4>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {order.customer?.fullName || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {order.customer?.email || "N/A"}
            </p>
            <p>
              <span className="font-medium">Mobile:</span>{" "}
              {order.customer?.mobileNumber || "N/A"}
            </p>
          </div>

          {/* Payment Details */}
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            <TypographyH4>Payment Details</TypographyH4>
            <p>
              <span className="font-medium">Method:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Reference:</span>{" "}
              {order.payment?.referenceNumber || "N/A"}
            </p>
            {order.payment?.receiptImage && (
              <div className="flex flex-col gap-2">
                <span className="font-medium">Receipt:</span>
                <Image
                  src={order.payment.receiptImage.url}
                  alt="Receipt"
                  width={400}
                  height={400}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
