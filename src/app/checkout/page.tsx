"use client";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { TypographyH1, TypographyH4 } from "@/components/custom-ui/typography";
import { useAppStore } from "@/lib/store";
import { cn, convertCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CartItem from "@/components/products/cart/CartItem";
import {
  TImageReceipt,
  //   TImageReceipt,
  TOrder,
  TOrderItem,
  TPaymentDetails,
  TPaymentMethod,
  //   TOrderItem,
  //   TPaymentDetails,
  //   TPaymentMethod,
} from "@/typings";
import {
  dbSetDocument,
  dbUpdateDocumentWhereMulti,
} from "@/lib/firebase/actions";
import {
  DB_COLLECTION,
  DB_METHOD_STATUS,
  OCCASIONS,
  PAYMENT_OPTION,
} from "@/lib/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import dynamic from "next/dynamic";
import { increment } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { getAuth, signInAnonymously } from "firebase/auth";
import ReceiptScreenshotUpload from "@/components/custom-ui/ReceiptScreenshotUpload";
import PaymentOptionSelect from "@/components/custom-ui/PaymentOptionSelect";
import Link from "next/link";
import Image from "next/image";
import PaymentDetailsItem from "@/components/custom-ui/PaymentDetailsItem";
import { Badge } from "@/components/ui/badge";

// ...
const MapWithMarker = dynamic(
  () => import("@/components/custom-ui/MapWithMarker"),
  {
    ssr: false,
  }
);


// custom pin icon (Leaflet requires explicit icon)
function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    customerCart,
    googleUser,
    setCustomerCart,
    setGoogleUser,
    currentSettings,
  } = useAppStore();
const DELIVERY_FEE = currentSettings.deliveryFee;
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">(
    "pickup"
  );
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationDetails, setLocationDetails] = useState("");
  const [isPagadian, setIsPagadian] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [occasion, setOccasion] = useState("");
  const [email, setEmail] = useState("");

  const onLogin = () => {
    if (!firstName || !lastName) {
      toast.error("Full name required");
      return;
    }
    if (!email) {
      toast.error("Email address required");
      return;
    }
    if (!mobileNumber) {
      toast.error("Mobile number required");
      return;
    }
    const auth = getAuth();
    signInAnonymously(auth)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        // Signed in..
        setGoogleUser({
          displayName: `${firstName} ${lastName}`,
          email: email,
          uid: uid,
          photoURL: null,
        });
        toast.success("You are now signed in!");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ...
      });
  };
  const [paymentOption, setPaymentOption] = useState<TPaymentMethod>(
    PAYMENT_OPTION.E_WALLET.id as TPaymentMethod
  );
  const [receiptImage, setReceiptImage] = useState<TImageReceipt | null>(null);
  const [selectedPaymentDetails, setSelectedPaymentDetails] =
    useState<TPaymentDetails | null>(null);
  const isDelivery = deliveryOption === "delivery";
  const total = customerCart
    ? customerCart.total + (isDelivery ? DELIVERY_FEE : 0)
    : 0;
  const isInPagadianCity = (lat: number, lng: number): boolean => {
    return lat >= 7.799 && lat <= 7.883 && lng >= 123.399 && lng <= 123.525;
  };
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

  useEffect(() => {
    if (position) {
      const res = isInPagadianCity(position[0], position[1]);
      setIsPagadian(res);
    }
  }, [position]);

  useEffect(() => {
    const paymentDetails =
      currentSettings?.paymentOptions?.filter(
        (option) => option.paymentMethod === paymentOption
      )[0] || null;
    setSelectedPaymentDetails(paymentDetails);
    if (paymentOption === "CASH") {
      setReferenceNumber(
        `${paymentDetails?.accountName} - ${paymentDetails?.accountNumber}`
      );
    } else {
      setReferenceNumber("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentOption]);

  const onConfirmOrder = async () => {
    if (!customerCart) return;
    if (!selectedPaymentDetails) {
      toast.error("Select payment details");
      return;
    }
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
      emailAddress: email,
      branchID: customerCart.items[0]?.branchID ?? "unknown",
      items,
      totalAmount: total,
      paymentMethod: "CASH", // you can make this dynamic later
      status: "PENDING",
      orderType: isDelivery ? "DELIVERY" : "PICKUP",
      customer: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        mobileNumber,
      },
      occasion: occasion || null,
      // ✅ Add payment details
      payment: {
        option: selectedPaymentDetails,
        referenceNumber: referenceNumber || null,
        receiptImage: receiptImage || null,
      },
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

  const renderButtons = () => {
    if (!googleUser) {
      return (
        <Button className="w-full" variant={"secondary"} type="button" disabled>
          Please confirm your customer details
        </Button>
      );
    }
    if (!isPagadian && isDelivery) {
      return (
        <Button className="w-full" variant={"secondary"} type="button" disabled>
          Your delivery address is not within Pagadian City
        </Button>
      );
    }
    if (!firstName || !lastName || !mobileNumber) {
      return (
        <Button className="w-full" variant={"secondary"} type="button" disabled>
          Please complete your customer details
        </Button>
      );
    }

    if (paymentOption != "CASH" && !referenceNumber) {
      return (
        <Button className="w-full" variant={"secondary"} type="button" disabled>
          Reference number required
        </Button>
      );
    }

    return (
      <div>
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
  };

  if (!customerCart || customerCart.items.length === 0) {
    return (
      <div className="p-4 space-y-6 max-w-7xl w-full mx-auto">
        <TypographyH1>Checkout</TypographyH1>
        <p className="text-muted-foreground mt-4">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100">
      <div className="p-4 space-y-4 max-w-7xl w-full mx-auto">
        <TypographyH1>Checkout</TypographyH1>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="w-full space-y-4 border rounded-lg p-4 h-fit bg-white">
            {/* Cart Items */}
            <TypographyH4>Order Details</TypographyH4>
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
                onValueChange={(val: "delivery" | "pickup") =>
                  setDeliveryOption(val)
                }
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
                <h2 className="font-semibold">
                  Delivery Location (within Pagadian City only)
                </h2>
                {position && (
                  <MapWithMarker
                    position={position}
                    setPosition={setPosition}
                  />
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

            <div className="grid grid-cols-1 gap-2">
              <Label className="font-semibold text-base">
                Occasion (Birthday, Wedding, Anniversary…)
              </Label>
              <Input
                value={occasion}
                placeholder="🎂 What are we celebrating?"
                onChange={(val) => setOccasion(val.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {OCCASIONS.sort().map((item, idx) => {
                  return (
                    <Badge
                      onClick={() => setOccasion(item)}
                      key={`occasion-item-${idx}`}
                      className="cursor-pointer"
                      variant={
                        occasion.toLowerCase().includes(item.toLowerCase())
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-6 h-fit bg-white">
            <div className="space-y-4">
              <TypographyH4>Payment Details</TypographyH4>
              {googleUser ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label>First Name</Label>
                      <Input
                        value={firstName}
                        onChange={(val) => setFirstName(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Last Name</Label>
                      <Input
                        value={lastName}
                        onChange={(val) => setLastName(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Mobile Number</Label>
                      <Input
                        value={mobileNumber}
                        onChange={(val) => setMobileNumber(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Email Address</Label>
                      <Input
                        value={email}
                        onChange={(val) => setEmail(val.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label>First Name</Label>
                      <Input
                        value={firstName}
                        onChange={(val) => setFirstName(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Last Name</Label>
                      <Input
                        value={lastName}
                        onChange={(val) => setLastName(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Mobile Number</Label>
                      <Input
                        value={mobileNumber}
                        onChange={(val) => setMobileNumber(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Email Address</Label>
                      <Input
                        value={email}
                        onChange={(val) => setEmail(val.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Email Address</Label>
                      <Input
                        value={email}
                        onChange={(val) => setEmail(val.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    className="cursor-pointer"
                    type="button"
                    onClick={onLogin}
                  >
                    Confirm Customer Details
                  </Button>
                </div>
              )}
            </div>
            {googleUser ? (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label>Payment Type</Label>
                    <PaymentOptionSelect
                      value={paymentOption}
                      onChange={setPaymentOption}
                    />
                  </div>

                  {paymentOption != "CASH" ? (
                    <div className="space-y-2">
                      <Label
                        className={cn(
                          "",
                          selectedPaymentDetails === null
                            ? "text-red-500 animate-pulse"
                            : ""
                        )}
                      >
                        Select Payment Option
                      </Label>
                      {currentSettings?.paymentOptions
                        ?.filter(
                          (option) => option.paymentMethod === paymentOption
                        )
                        ?.map((item) => {
                          const isActive =
                            item.id === selectedPaymentDetails?.id;
                          return (
                            <div
                              onClick={() => setSelectedPaymentDetails(item)}
                              key={`payment-option-item-${item.id}`}
                              className={cn(
                                "opacity-50 hover:opacity-100 cursor-pointer border rounded-lg  overflow-hidden transition-all duration-150",
                                isActive ? "opacity-100" : ""
                              )}
                            >
                              <PaymentDetailsItem paymentDetails={item} />
                            </div>
                          );
                        })}
                    </div>
                  ) : null}
                  {paymentOption != "CASH" && (
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Upload a screenshot of your payment receipt</Label>
                      <ReceiptScreenshotUpload
                        value={receiptImage}
                        emailAddress={email}
                        userID={googleUser?.uid || "noid"}
                        onChange={setReceiptImage}
                      />
                      <div>
                        <span className="flex gap-2">
                          <Link
                            target="_blank"
                            href={`https://m.me/135923886545269`}
                          >
                            <button
                              type="button"
                              className="rounded-full hover:underline cursor-pointer flex mx-auto items-center gap-2 p-2 text-xs text-center"
                            >
                              If you&apos;re unable to upload the image, please
                              take a screenshot of your receipt and send it to
                              our Facebook page.
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
                      </div>
                    </div>
                  )}
                  {paymentOption != "CASH" ? (
                    <div className="grid grid-cols-1 gap-2">
                      <Label>Reference Number</Label>
                      <Input
                        value={referenceNumber}
                        onChange={(val) => setReferenceNumber(val.target.value)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

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
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
