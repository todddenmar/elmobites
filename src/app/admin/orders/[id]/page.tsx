"use client";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchDocument } from "@/lib/firebase/actions";
import { TOrder, TOrderPaymentStatus } from "@/typings";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { convertCurrency } from "@/lib/utils";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import { useAppStore } from "@/lib/store";
import { ArrowLeftIcon, MailIcon, UserIcon } from "lucide-react";
import { TypographyH4 } from "@/components/custom-ui/typography";
import dynamic from "next/dynamic";
import { DirectionButton } from "@/components/DirectionButton";
// dynamically import map
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  { ssr: false }
);
function AdminOrderPage() {
  const params = useParams();
  const orderID = params.id as string;
  const { currentSettings } = useAppStore();
  const [order, setOrder] = useState<TOrder | null>(null);
  useEffect(() => {
    const fetchOrder = async () => {
      const res = await dbFetchDocument(DB_COLLECTION.ORDERS, orderID);
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
        return;
      }
      if (res.data) {
        setOrder(res.data as TOrder);
      }
    };
    fetchOrder();
  }, [orderID]);

  const renderPaymentStatus = () => {
    const paymentStatus = order?.paymentStatus as TOrderPaymentStatus;
    switch (paymentStatus) {
      case "PAID":
        return <Badge className="bg-green-600 text-white">Paid</Badge>;
      case "UNPAID":
        return <Badge className="bg-red-600 text-white">Unpaid</Badge>;
      case "REFUNDED":
        return <Badge className="bg-orange-600 text-white">Refunded</Badge>;
    }
  };

  if (!order)
    return (
      <ErrorCard
        title="No order found!"
        description="The order you are trying to view is not available"
        linkText="Go Back"
        redirectionLink="/admin/orders"
      />
    );

  return (
    <div className="flex flex-col gap-4 flex-1 h-full p-4 rounded-lg">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-start">
          <Link href={"/admin/orders"} className="w-fit">
            <ArrowLeftIcon />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                Order #{order.orderNumber}
              </h1>{" "}
              {renderPaymentStatus()}
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="divide-y space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-sm">x {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {convertCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {convertCurrency(
                        order.items.reduce(
                          (prev, item) => prev + item.subtotal,
                          0
                        )
                      )}
                    </span>
                  </div>
                  {order.orderType === "DELIVERY" ? (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>
                        {convertCurrency(currentSettings.deliveryFee)}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{convertCurrency(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex gap-2 items-center">
                    <div className="rounded-lg w-[50px] aspect-square bg-muted flex flex-col items-center justify-center">
                      <UserIcon className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Rider name</div>
                      <div className="text-sm text-muted-foreground">
                        Rider number
                      </div>
                    </div>
                    <div>
                      {convertCurrency(
                        order.deliveryFee || currentSettings.deliveryFee
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {order.logs?.map((log, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm justify-between py-2"
                    >
                      <Badge
                        variant={
                          log.status === order.status ? "default" : "secondary"
                        }
                      >
                        {log.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(log.changedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Invoice details */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm divide-y">
                  <div className="pb-4">
                    <div className="font-semibold">
                      {order.customer.fullName}
                    </div>
                    <div>{order.customer.mobileNumber}</div>
                  </div>
                  <div className="py-4 flex items-center gap-2">
                    <MailIcon size={18} />
                    {order.customer.email}
                  </div>
                  <div className="py-4 space-y-4">
                    <TypographyH4>Location</TypographyH4>
                    <div>{order.locationDetails}</div>
                    {order.orderType === "DELIVERY" && order.coordinates && (
                      <div className="space-y-4">
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
                        <DirectionButton
                          latitude={order.coordinates.latitude}
                          longitude={order.coordinates.longitude}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderPage;
