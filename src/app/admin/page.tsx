import { TypographyH4 } from "@/components/custom-ui/typography";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertCurrency, customDateFormat } from "@/lib/utils";
import {
  ClipboardListIcon,
  PhilippinePesoIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { ReactNode } from "react";
function AdminPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <OverviewCard
          title="Total Sales Today"
          icon={<PhilippinePesoIcon className="text-muted-foreground" />}
          content={convertCurrency(1990)}
        />
        <OverviewCard
          title="Orders Today"
          icon={<ClipboardListIcon className="text-muted-foreground" />}
          content={3}
        />
        <OverviewCard
          title="Customers Today"
          icon={<UserIcon className="text-muted-foreground" />}
          content={5}
        />
        <OverviewCard
          title="Top Product Today"
          icon={<StarIcon className="text-muted-foreground" />}
          content={"Lemon Butter with 3 Orders"}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1 h-full ">
        <div className="flex xl:col-span-1 gap-4 flex-col bg-white p-4 rounded-lg h-full w-full 2xl:max-w-sm">
          <TypographyH4>Recent Orders</TypographyH4>
          <ScrollArea className="flex-1 border rounded-lg p-2">
            <div className="space-y-2">
              <div className="border rounded-lg p-2 space-y-2">
                <div className="flex items-center gap-4 justify-between text-sm">
                  <div> Order# 1</div>
                  <Badge>Pick-Up</Badge>
                </div>
                <div className="text-sm">
                  {customDateFormat(new Date(), true)}
                </div>
                <div className="bg-orange-300 p-1 rounded-lg text-sm text-center">
                  PREPARING
                </div>
              </div>
              <div className="border rounded-lg p-2 space-y-2">
                <div className="flex items-center gap-4 justify-between text-sm">
                  <div> Order# 2</div>
                  <Badge variant={"secondary"}>Delivery</Badge>
                </div>
                <div className="text-sm">
                  {customDateFormat(new Date(), true)}
                </div>
                <div className="bg-red-300 p-1 rounded-lg text-sm text-center">
                  PENDING
                </div>
              </div>
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
