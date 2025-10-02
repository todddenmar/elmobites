"use client";
import { CompletedOrdersTable } from "@/components/admin/dashboard/CompletedOrdersTable";
import { Top5ProductsChart } from "@/components/admin/dashboard/Top5ProductsChart";
import RecentOrderItem from "@/components/admin/orders/RecentOrderItem";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/firebase";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchCollectionWhere2 } from "@/lib/firebase/actions";
import {
  getActiveOrdersCount,
  getTopProductToday,
  getTotalSalesToday,
} from "@/lib/firebase/custom-queries";
import { useAppStore } from "@/lib/store";
import { convertCurrency } from "@/lib/utils";
import { TOrder } from "@/typings";
import { endOfDay, startOfDay } from "date-fns";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  ClipboardCheckIcon,
  ClipboardListIcon,
  PhilippinePesoIcon,
  StarIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
function AdminPage() {
  const { currentActiveOrders, setCurrentActiveOrders, currentStores } =
    useAppStore();
  const [salesToday, setSalesToday] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [topProduct, setTopProduct] = useState<string | null>(null);
  const [completedOrdersToday, setCompletedOrdersToday] = useState<TOrder[]>(
    []
  );

  useEffect(() => {
    const ref = collection(db, "orders");
    const q = query(
      ref,
      where("status", "in", [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "OUT_FOR_DELIVERY",
      ])
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders: TOrder[] = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as TOrder);
      });
      setCurrentActiveOrders(orders);
    });
    return () => unsubscribe(); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      const sales = await getTotalSalesToday();
      setSalesToday(sales);
      const activeOrders = await getActiveOrdersCount();
      setTotalActive(activeOrders);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = Timestamp.fromDate(startOfDay(new Date()));
      const end = Timestamp.fromDate(endOfDay(new Date()));

      const res = await dbFetchCollectionWhere2({
        collectionName: DB_COLLECTION.ORDERS,
        where: {
          fieldName: "status",
          fieldValue: "COMPLETED",
          operation: "==",
        },
        where2: {
          fieldName: "timestamp",
          fieldValue: [start, end],
          operation: "between", // you’ll need to handle this in dbFetchCollectionWhere2
        },
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
      }
      if (res.data) {
        setCompletedOrdersToday(res.data as TOrder[]);
        setTotalCompleted(res.data.length);
      }
      const top = await getTopProductToday();
      setTopProduct(top);
    };
    fetchDashboardData();
  }, [currentActiveOrders]);
  return (
    <div className="flex-1 flex flex-col gap-4 h-full p-4 lg:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        <div className="flex flex-col lg:col-span-2 xl:col-span-3 gap-4">
          <div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <OverviewCard
              title="Total Sales Today"
              icon={<PhilippinePesoIcon className="text-muted-foreground" />}
              content={convertCurrency(salesToday)}
            />
            <OverviewCard
              title="Active Orders"
              icon={<ClipboardListIcon className="text-muted-foreground" />}
              content={totalActive}
            />
            <OverviewCard
              title="Orders Completed Today"
              icon={<ClipboardCheckIcon className="text-muted-foreground" />}
              content={totalCompleted}
            />
            <OverviewCard
              title="Top Product Today"
              icon={<StarIcon className="text-muted-foreground" />}
              content={topProduct || "none"}
            />
          </div>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Completed Orders Today</CardTitle>
              <CardDescription>
                All completed orders in this date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex-1">
                <CompletedOrdersTable
                  orders={completedOrdersToday.map((item) => ({
                    ...item,
                    customerName: item.customer.fullName,
                    storeName:
                      currentStores.find((s) => s.id === item.branchID)?.name ||
                      "",
                    referenceNumber: item.payment.referenceNumber || "",
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2 xl:col-span-1">
          <Top5ProductsChart />
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders by date</CardDescription>
            </CardHeader>
            <CardContent>
              {currentActiveOrders.length > 0 ? (
                <ScrollArea className="border rounded-lg p-2">
                  <div className="space-y-2">
                    {currentActiveOrders.map((item) => {
                      return (
                        <RecentOrderItem
                          key={`active-orders-${item.id}`}
                          order={item}
                        />
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyLayout>No Recent Orders</EmptyLayout>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

type OverviewCardProps = {
  title: string;
  icon: ReactNode;
  content: ReactNode;
};
function OverviewCard({ title, icon, content }: OverviewCardProps) {
  return (
    <div className="bg-white/5 border rounded-lg p-2 lg:p-4 text-sm relative">
      <div>
        <div>{title}</div>
        <div className="absolute right-2 top-2 lg:right-4 lg:top-4">{icon}</div>
      </div>
      <div className="text-base">
        <div>{content}</div>
      </div>
    </div>
  );
}

export default AdminPage;
