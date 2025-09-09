"use client";
import RecentOrderItem from "@/components/admin/orders/RecentOrderItem";
import { TypographyH4 } from "@/components/custom-ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/firebase";
import {
  getActiveOrdersCount,
  getCompletedOrdersToday,
  getTopProductToday,
  getTotalSalesToday,
} from "@/lib/firebase/custom-queries";
import { useAppStore } from "@/lib/store";
import { convertCurrency } from "@/lib/utils";
import { TOrder } from "@/typings";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  ClipboardCheckIcon,
  ClipboardListIcon,
  PhilippinePesoIcon,
  StarIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
function AdminPage() {
  const { currentActiveOrders, setCurrentActiveOrders } = useAppStore();
  const [salesToday, setSalesToday] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [topProduct, setTopProduct] = useState<string | null>(null);

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
      const completed = await getCompletedOrdersToday();
      setTotalCompleted(completed);
      const top = await getTopProductToday();
      setTopProduct(top);
    };
    fetchDashboardData();
  }, []);
  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1 h-full ">
        <div className="flex xl:col-span-1 gap-4 flex-col bg-white p-4 rounded-lg h-full w-full 2xl:max-w-sm">
          <TypographyH4>Recent Orders</TypographyH4>
          <ScrollArea className="flex-1 border rounded-lg p-2">
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
        </div>
        <div className="flex-1 xl:col-span-2 2xl:col-span-3 flex flex-col gap-4 bg-white p-4 rounded-lg h-full"></div>
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
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-semibold">{title}</div>
        <div className="bg-muted p-2 rounded-full">{icon}</div>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default AdminPage;
