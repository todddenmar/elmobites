"use client";

import { TypographyH1 } from "@/components/custom-ui/typography";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TOrder } from "@/typings";
import { dbFetchCollectionWhere } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";

// Mock fetch - replace with Firestore fetch for logged-in user
async function fetchOrders(userID: string): Promise<TOrder[]> {
  const res = await dbFetchCollectionWhere({
    collectionName: DB_COLLECTION.ORDERS,
    fieldName: "userID",
    fieldValue: userID,
  });
  if (res.status === DB_METHOD_STATUS.ERROR) {
    console.log(res.message);
    return [];
  }
  if (res.data) {
    return res.data as TOrder[];
  }
  return [];
}

export default function OrdersPage() {
  const { googleUser } = useAppStore();
  const [orders, setOrders] = useState<TOrder[]>([]);
  const router = useRouter();
  console.log({ googleUser });

  useEffect(() => {
    if (googleUser) fetchOrders(googleUser?.uid).then(setOrders);
  }, [googleUser]);

  return (
    <div className="p-6 space-y-6">
      <TypographyH1>My Orders</TypographyH1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.status} • {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold mt-1">
                  ₱{order.totalAmount.toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
