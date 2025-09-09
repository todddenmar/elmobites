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

// Mock fetch - replace with Firestore document fetch
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

  useEffect(() => {
    if (orderId) fetchOrderById(orderId).then(setOrder);
  }, [orderId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, DB_COLLECTION.ORDERS, orderId),
      (docItem) => {
        console.log("Current data: ", docItem.data());
        const orderResult = docItem.data() as TOrder;
        if (orderResult) setOrder(orderResult);
      }
    );
    return () => unsubscribe(); // Cleanup on unmount
  }, [orderId]);

  if (!order) {
    return <p className="p-6">Loading order...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        type="button"
        onClick={() => router.push("/orders")}
      >
        <ArrowLeftIcon /> Back to My Orders
      </Button>
      <TypographyH4>Order #{order.id}</TypographyH4>

      <div className="text-sm">
        <p>
          Status: <span className="font-medium">{order.status}</span>
        </p>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Payment Method: {order.paymentMethod}</p>
      </div>

      {/* Items */}
      <div className="space-y-3 border-t pt-4">
        <TypographyH4>Items</TypographyH4>
        {order.items.map((item: TOrderItem) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>₱{item.subtotal.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg border-t pt-4">
        <span>Total</span>
        <span>₱{order.totalAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}
