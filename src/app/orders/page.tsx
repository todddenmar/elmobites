"use client";

import { TypographyH4 } from "@/components/custom-ui/typography";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TOrder } from "@/typings";
import { dbFetchCollectionWhere } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";

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
      <TypographyH4>My Orders</TypographyH4>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border text-sm rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p>Order #{order.id}</p>
                <p className="text-muted-foreground text-xs">
                  {order.status} • {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mt-1">₱{order.totalAmount.toLocaleString()}</p>
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
