"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { TOrder } from "@/typings";

export function Top5ProductsChart() {
  const [monthlyOrders, setMonthlyOrders] = useState<TOrder[]>([]);

  // fetch completed orders for this month
  useEffect(() => {
    const start = Timestamp.fromDate(startOfMonth(new Date()));
    const end = Timestamp.fromDate(endOfMonth(new Date()));
    const ref = collection(db, "orders");
    const q = query(
      ref,
      where("status", "==", "COMPLETED"),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders: TOrder[] = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as TOrder);
      });
      setMonthlyOrders(orders);
    });
    return () => unsubscribe();
  }, []);

  // compute top 5 variants
  const chartData = useMemo(() => {
    const variantSales: Record<string, { name: string; quantity: number }> = {};

    monthlyOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.variantID || item.productID;
        if (!variantSales[key]) {
          variantSales[key] = {
            name: item.variantName
              ? `${item.productName} - ${item.variantName}`
              : item.productName,
            quantity: 0,
          };
        }
        variantSales[key].quantity += item.quantity;
      });
    });

    // sort by quantity sold, take top 5
    const top5 = Object.values(variantSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // recharts format
    return top5.map((item, i) => ({
      name: item.name,
      sold: item.quantity,
      fill: `var(--chart-${(i % 5) + 1})`, // cycle through 5 chart colors
    }));
  }, [monthlyOrders]);

  const chartConfig = {
    sold: {
      label: "Units Sold",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Variants Sold</CardTitle>
        <CardDescription>{format(new Date(), "LLLL yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="sold" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="sold" layout="vertical" radius={6}>
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing completed orders for {format(new Date(), "LLLL yyyy")}
        </div>
      </CardFooter>
    </Card>
  );
}
