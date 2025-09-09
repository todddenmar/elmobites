import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { DB_COLLECTION } from "../config";
import { TOrder } from "@/typings";

export async function getTotalSalesToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of day

  const q = query(
    collection(db, DB_COLLECTION.ORDERS),
    where("status", "==", "COMPLETED"),
    where("createdAt", ">=", today.toISOString())
  );

  const snapshot = await getDocs(q);
  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    total += data.totalAmount || 0;
  });

  return total;
}

export async function getActiveOrdersCount() {
  const q = query(
    collection(db, DB_COLLECTION.ORDERS),
    where("status", "in", [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "OUT_FOR_DELIVERY",
    ])
  );

  const snapshot = await getDocs(q);
  return snapshot.size; // count only
}

export async function getCompletedOrdersToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, DB_COLLECTION.ORDERS),
    where("status", "==", "COMPLETED"),
    where("createdAt", ">=", today.toISOString())
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function getTopProductToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, DB_COLLECTION.ORDERS),
    where("status", "==", "COMPLETED"),
    where("createdAt", ">=", today.toISOString())
  );

  const snapshot = await getDocs(q);

  const productCount: Record<string, { name: string; count: number }> = {};

  snapshot.forEach((doc) => {
    const data = doc.data() as TOrder;
    data.items.forEach((item) => {
      if (!productCount[item.productID]) {
        productCount[item.productID] = { name: item.productName, count: 0 };
      }
      productCount[item.productID].count += item.quantity;
    });
  });

  const topProduct = Object.values(productCount).sort(
    (a, b) => b.count - a.count
  )[0];

  if (!topProduct) return null;
  return `${topProduct.name} with ${topProduct.count} Orders`;
}
