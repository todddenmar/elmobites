"use client";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { TypographyH1 } from "@/components/custom-ui/typography";
import { useAppStore } from "@/lib/store";
import { convertCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CartItem from "@/components/products/cart/CartItem";
import {
  //   TImageReceipt,
  TOrder,
  TOrderItem,
  //   TOrderItem,
  //   TPaymentDetails,
  //   TPaymentMethod,
} from "@/typings";
import {
  dbSetDocument,
  dbUpdateDocumentWhereMulti,
} from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import dynamic from "next/dynamic";
import { increment } from "firebase/firestore";

// ...
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  {
    ssr: false,
  }
);
const DELIVERY_FEE = 50;

// custom pin icon (Leaflet requires explicit icon)
function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { customerCart, googleUser, setCustomerCart } = useAppStore();
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">(
    "pickup"
  );
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationDetails, setLocationDetails] = useState("");
  //   const [paymentOption, setPaymentOption] = useState<TPaymentMethod>(
  //     PAYMENT_OPTION.E_WALLET.id as TPaymentMethod
  //   );
  //   const [receiptImage, setReceiptImage] = useState<TImageReceipt | null>(null);
  //   const [selectedPaymentDetails, setSelectedPaymentDetails] =
  //     useState<TPaymentDetails | null>(null);
  const isDelivery = deliveryOption === "delivery";
  const total = customerCart
    ? customerCart.total + (isDelivery ? DELIVERY_FEE : 0)
    : 0;

  // get browser location
  useEffect(() => {
    if (isDelivery && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => console.error("Location access denied")
      );
    }
  }, [isDelivery]);

  const onConfirmOrder = async () => {
    if (!customerCart) return;
    setIsLoading(true);
    // build order items
    const items: TOrderItem[] = customerCart.items.map((item) => ({
      id: crypto.randomUUID(),
      productID: item.productID,
      variantID: item.variantID ?? null,
      productName: item.name,
      variantName: item.variantName ?? null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      branchID: item.branchID,
    }));

    // build order
    const order: TOrder = {
      id: crypto.randomUUID(),
      userID: googleUser?.uid || "guest",
      branchID: customerCart.items[0]?.branchID ?? "unknown",
      items,
      totalAmount: total,
      paymentMethod: "CASH", // you can make this dynamic later
      status: "PENDING",
      orderType: isDelivery ? "DELIVERY" : "PICKUP",
      notes: isDelivery
        ? `Delivery: ${locationDetails}`
        : locationDetails || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(), // Firestore serverTimestamp later
      coordinates:
        isDelivery && position
          ? {
              latitude: position[0],
              longitude: position[1],
            }
          : null,
    };

    console.log("Order Data:", order);

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.ORDERS,
      id: order.id,
      data: order,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      setIsLoading(false);
      return;
    }

    await updateInventory(order.items);

    setCustomerCart(null);
    toast.success("Order successfully created");
    router.push("/orders/" + order.id);
  };

  const updateInventory = async (items: TOrderItem[]) => {
    for (const item of items) {
      try {
        const res = await dbUpdateDocumentWhereMulti(
          DB_COLLECTION.INVENTORY,
          [
            { field: "productID", op: "==", value: item.productID },
            { field: "variantID", op: "==", value: item.variantID },
            { field: "branchID", op: "==", value: item.branchID },
          ],
          {
            stock: increment(-item.quantity), // 🔥 decrement by order quantity
          }
        );

        if (res.status === DB_METHOD_STATUS.ERROR) {
          console.error("Inventory update failed:", res.message);
        }
      } catch (err) {
        console.error("Inventory update error:", err);
      }
    }
  };

  if (!customerCart || customerCart.items.length === 0) {
    return (
      <div className="p-6">
        <TypographyH1>Checkout</TypographyH1>
        <p className="text-muted-foreground mt-4">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <TypographyH1>Checkout</TypographyH1>

      {/* Cart Items */}
      <div className="space-y-4">
        {customerCart.items.map((item) => (
          <CartItem key={`checkout-item-${item.id}`} cartItem={item} />
        ))}
      </div>

      {/* Delivery / Pickup Option */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="font-semibold">Choose Order Option</h2>
        <RadioGroup
          value={deliveryOption}
          onValueChange={(val: "delivery" | "pickup") => setDeliveryOption(val)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup">Pick-up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery">Delivery</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Map & Location Details */}
      {isDelivery && (
        <div className="space-y-4 border-t pt-4">
          <h2 className="font-semibold">Delivery Location</h2>
          {position && (
            <MapWithMarker position={position} setPosition={setPosition} />
          )}
          <textarea
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
            placeholder="Add more details (house number, landmarks, etc.)"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
          />
        </div>
      )}

      {/* <div>
        <FormItem>
          <FormLabel>Payment Type</FormLabel>
          <PaymentOptionSelect
            value={paymentOption}
            onChange={setPaymentOption}
          />
        </FormItem>
        <div className="space-y-2">
          <Label
            className={cn(
              selectedPaymentDetails === null
                ? "text-red-500 animate-pulse"
                : ""
            )}
          >
            Select Payment Option
          </Label>
          {event?.paymentOptions
            ?.filter((option) => option.paymentMethod === paymentOption)
            ?.map((item) => {
              const isActive = item.id === selectedPaymentDetails?.id;
              return (
                <div
                  onClick={() => setSelectedPaymentDetails(item)}
                  key={`payment-option-item-${item.id}`}
                  className={cn(
                    "opacity-50 hover:opacity-100 cursor-pointer border rounded-lg  overflow-hidden transition-all duration-150",
                    isActive
                      ? "border-lime-500 opacity-100"
                      : "hover:border-white/20"
                  )}
                >
                  <PaymentDetailsItem paymentDetails={item} />
                </div>
              );
            })}
        </div>

        {paymentOption != "CASH" && (
          <div className="space-y-2">
            <Label>Upload a screenshot of your payment receipt</Label>
            <ReceiptScreenshotUpload
              value={receiptImage}
              emailAddress={googleUser.email}
              racerID={racerID}
              onChange={setReceiptImage}
            />
            <FormDescription>
              {event.isReceiptRequired ? (
                <span className="flex gap-2">
                  <Link target="_blank" href={`https://m.me/eventracers`}>
                    <button
                      type="button"
                      className="rounded-full  flex mx-auto items-center gap-2 p-2 text-xs text-orange-500 text-center"
                    >
                      If you can&apos;t upload the image, take a screenshot of
                      your form and send both images to us so we can help you
                      register.
                      <Image
                        src={"/icons/messenger.png"}
                        alt="messenger icon"
                        className="w-10"
                        width={50}
                        height={50}
                      />
                    </button>
                  </Link>
                </span>
              ) : (
                "Not Required but this helps us verify and process your payment faster"
              )}
            </FormDescription>
          </div>
        )}
        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}
      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{convertCurrency(customerCart.subtotal)}</span>
        </div>
        {isDelivery && (
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>{convertCurrency(DELIVERY_FEE)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>{convertCurrency(total)}</span>
        </div>
      </div>

      {/* Actions */}
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="flex justify-end">
          <Button
            onClick={onConfirmOrder}
            size="lg"
            className="w-full sm:w-auto"
          >
            Confirm Order ({isDelivery ? "Delivery" : "Pick-up"})
          </Button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
