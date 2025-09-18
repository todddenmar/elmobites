"use client";
import { AdminOrdersTable } from "@/components/admin/orders/AdminOrdersTable";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { db } from "@/firebase";
import { useAppStore } from "@/lib/store";
import { TOrder, TOrderTableItem } from "@/typings";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

function AdminOrdersPage() {
  const { currentStores } = useAppStore();
  const [monthlyOrders, setMonthlyOrders] = useState<TOrderTableItem[]>([]);
  useEffect(() => {
    const start = Timestamp.fromDate(startOfMonth(new Date()));
    const end = Timestamp.fromDate(endOfMonth(new Date()));
    const ref = collection(db, "orders");
    const q = query(
      ref,
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders: TOrder[] = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as TOrder);
      });
      setMonthlyOrders(
        orders.map((item) => ({
          ...item,
          customerName: item.customer.fullName,
          storeName:
            currentStores.find((s) => s.id === item.branchID)?.name || "",
          referenceNumber: item.payment.referenceNumber || "",
        }))
      );
    });
    return () => unsubscribe(); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-4 flex-1 h-full bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4 lg:flex justify-between items-center w-full">
        <SectionTitle>Orders</SectionTitle>

        <div className="flex justify-between gap-4"></div>
      </div>
      <div className="flex-1 grid">
        <AdminOrdersTable orders={monthlyOrders} />
      </div>
    </div>
  );
}

export default AdminOrdersPage;
