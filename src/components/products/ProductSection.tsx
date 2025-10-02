"use client";
import React, { useEffect, useState } from "react";
import {
  TCart,
  TCartItem,
  TInventory,
  TProduct,
  TProductCategory,
} from "@/typings";
import ProductPageGallery from "./ProductPageGallery";
import { useSearchParams } from "next/navigation";
import { cn, convertCurrency } from "@/lib/utils";
import EmptyLayout from "../custom-ui/EmptyLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Label } from "../ui/label";
import CartButton from "./cart/CartButton";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import ProductBranchMapDialog from "./ProductBranchMapDialog";
type ProductSectionProps = {
  product: TProduct;
  category: TProductCategory | null;
  isPage?: boolean;
};
function ProductSection({ product, category }: ProductSectionProps) {
  const searchParams = useSearchParams();
  const { googleUser, customerCart, setCustomerCart, currentStores } =
    useAppStore();
  const searchQuery = searchParams.get("variant");
  const selectedVariant = searchQuery
    ? product.variants.find((item) => item.id === searchQuery) ||
      product.variants[0]
    : product.variants[0];

  const [inventory, setInventory] = useState<TInventory[]>();
  const [selectedBranchID, setSelectedBranchID] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // find selected branch's stock
  const selectedInventory = inventory?.find(
    (inv) => inv.branchID === selectedBranchID
  );
  const maxStock = selectedInventory?.stock || 0;

  // handlers
  const increaseQty = () => {
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  };
  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  useEffect(() => {
    if (currentStores) {
      if (currentStores[0]) {
        setSelectedBranchID(currentStores[0].id);
      }
    }
  }, [currentStores]);

  useEffect(() => {
    const ref = collection(db, "inventory");
    const q = query(
      ref,
      where("productID", "==", product.id),
      where("variantID", "==", selectedVariant.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryItems: TInventory[] = [];
      querySnapshot.forEach((doc) => {
        inventoryItems.push(doc.data() as TInventory);
      });

      setInventory(inventoryItems);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [product.id, selectedVariant.id]);

  useEffect(() => {
    if (quantity > maxStock) {
      setQuantity(maxStock > 0 ? maxStock : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchID, maxStock]);
  if (!selectedVariant) {
    return <EmptyLayout>No Variant For this Product</EmptyLayout>;
  }

  const onAddToCart = () => {
    if (!selectedBranchID || maxStock === 0) return;

    // check if item already exists in cart
    const existingItemIndex = customerCart?.items.findIndex(
      (item) =>
        item.variantID === selectedVariant.id &&
        item.branchID === selectedBranchID
    );

    let updatedItems: TCartItem[];

    if (existingItemIndex !== undefined && existingItemIndex > -1) {
      // item exists -> update quantity
      updatedItems = customerCart!.items.map((item, idx) =>
        idx === existingItemIndex
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, maxStock), // don’t exceed stock
            }
          : item
      );
    } else {
      // item doesn't exist -> add new one
      if (!selectedInventory) {
        console.log({ selectedInventory });
        return;
      }
      const newCartItem: TCartItem = {
        id: crypto.randomUUID(),
        productID: product.id,
        variantID: selectedVariant.id,
        branchID: selectedBranchID,
        name: product.name,
        variantName: selectedVariant.name,
        quantity,
        price: selectedVariant.price,
        stockAvailable: maxStock,
        inventoryID: selectedInventory?.id,
      };

      updatedItems = customerCart?.items
        ? [...customerCart.items, newCartItem]
        : [newCartItem];
    }

    const newCart: TCart = {
      id: customerCart?.id || crypto.randomUUID(),
      userID: googleUser?.uid,
      createdAt: customerCart?.createdAt || new Date().toISOString(),
      items: updatedItems,
      subtotal: updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      updatedAt: new Date().toISOString(),
      total: updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };

    setCustomerCart(newCart);
    toast.success("Added to cart");
  };

  const uniqueBranches = inventory
    ? Array.from(
        new Map(inventory.map((item) => [item.branchID, item])).values()
      )
    : [];

    type BranchStatusProps = {
      openingTime: string; // "HH:mm"
      closingTime: string; // "HH:mm"
    };

    const BranchStatus: React.FC<BranchStatusProps> = ({
      openingTime,
      closingTime,
    }) => {
      if (!openingTime || !closingTime) return null;

      const now = new Date();
      console.log({ openingTime, closingTime });

      const [openHour, openMinute] = openingTime.split(":").map(Number);
      const [closeHour, closeMinute] = closingTime.split(":").map(Number);

      const openDate = new Date();
      openDate.setHours(openHour, openMinute, 0, 0);

      const closeDate = new Date();
      closeDate.setHours(closeHour, closeMinute, 0, 0);

      let message: string | null = null;

      if (closeDate <= openDate) {
        // 🕑 Branch closes after midnight (e.g. 18:00 → 02:00)
        if (now < openDate && now > closeDate) {
          message = `Our store will open at ${openingTime}`;
        }
      } else {
        // ✅ Normal same-day schedule
        if (now < openDate) {
          message = `Our store will open at ${openingTime}`;
        } else if (now > closeDate) {
          message = `Our store is already closed`;
        }
      }

      if (!message) return null; // currently open

      return (
        <div className="p-3 text-sm text-center rounded-md bg-red-100 text-red-700">
          {message}
        </div>
      );
    };
    const isStoreOpen = (openingTime: string, closingTime: string) => {
      const now = new Date();
      const [openHour, openMinute] = openingTime.split(":").map(Number);
      const [closeHour, closeMinute] = closingTime.split(":").map(Number);

      const open = new Date();
      open.setHours(openHour, openMinute, 0, 0);

      const close = new Date();
      close.setHours(closeHour, closeMinute, 0, 0);

      return now >= open && now <= close;
    };

    const renderButtons = () => {
      if (!selectedBranchID) {
        return <EmptyLayout>Select a branch</EmptyLayout>;
      }

      const storeData = currentStores.find(
        (item) => item.id === selectedBranchID
      );

      if (!storeData) {
        return <EmptyLayout>Branch not found</EmptyLayout>;
      }

      const isOpen = isStoreOpen(storeData.openingTime, storeData.closingTime);

      return (
        <>
          <BranchStatus
            openingTime={storeData.openingTime}
            closingTime={storeData.closingTime}
          />
          <p className="text-sm text-muted-foreground">
            {maxStock > 0 ? `${maxStock} in stock` : "Out of stock"}
          </p>
          {isOpen ? (
            maxStock < 1 ? null : (
              <div className="grid gap-4 sticky bottom-0 py-4 bg-white/5 left-0 right-0 h-fit">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={onAddToCart}
                    className="w-full cursor-pointer"
                    type="button"
                    size="lg"
                    variant="outline"
                  >
                    <ShoppingCartIcon /> Add To Cart
                  </Button>
                  {customerCart ? (
                    customerCart.items.length > 0 ? (
                      <CartButton isContinue />
                    ) : (
                      <Link href={"/checkout"}>
                        <Button
                          onClick={onAddToCart}
                          className="w-full cursor-pointer"
                          type="button"
                          size="lg"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href={"/checkout"}>
                      <Button
                        onClick={onAddToCart}
                        className="w-full cursor-pointer"
                        type="button"
                        size="lg"
                      >
                        Buy Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          ) : null}
        </>
      );
    };

    return (
      <div>
        <div className="px-4 py-2 lg:mx-auto lg:max-w-7xl z-10 sticky top-0 left-0 right-0 bg-white/5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>...</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto lg:max-w-7xl lg:p-4 lg:gap-4">
          <div>
            <ProductPageGallery
              imageURLs={
                selectedVariant?.imageURLs?.map((item) => item) ||
                product.images.map((item) => item.url) ||
                []
              }
            />
          </div>
          <div className="rounded-t-2xl -mt-4 lg:-mt-0 z-10 p-0 pt-4 lg:p-4 relative bg-white/5">
            <div
              className={cn(
                "w-full group relative p-4 rounded-lg flex flex-col justify-center"
              )}
            >
              <div className="relative z-20 space-y-2 lg:space-y-4 flex flex-col h-full flex-1 ">
                <div className="flex-1">
                  <div className="font-accent uppercase text-3xl leading-6 lg:leading-10 lg:text-5xl">
                    {product.name}
                  </div>
                  {category ? (
                    <div className="font-signature text-4xl lg:text-6xl -mt-2 lg:-mt-4 ml-5">
                      {category?.name}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-4">
                  <p className="uppercase font-secondary text-xs lg:text-lg">
                    {product.description}
                  </p>
                  <div className="text-2xl">
                    {convertCurrency(selectedVariant.price)}
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <div className="flex items-center flex-wrap gap-2 lg:gap-4 text-sm lg:text-xl font-secondary font-medium">
                      {product.variants.map((variant) => {
                        const isSelected = variant.id === selectedVariant.id;
                        return (
                          <Link
                            key={`variant-${variant.id}`}
                            href={`/products/${product.slug}?variant=${variant.id}`}
                          >
                            <Button
                              type="button"
                              className="cursor-pointer"
                              variant={isSelected ? "default" : "outline"}
                            >
                              {variant.name}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Branch</Label>{" "}
                      {selectedBranchID ? (
                        <ProductBranchMapDialog branchID={selectedBranchID} />
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:gap-4">
                      {uniqueBranches?.map((item) => {
                        const store = currentStores.find(
                          (s) => s.id === item.branchID
                        );

                        if (!store) return null;
                        const isActive = store.id === selectedBranchID;
                        return (
                          <Button
                            type="button"
                            variant={isActive ? "default" : "outline"}
                            key={`branch-item-${item.id}`}
                            className="cursor-pointer"
                            onClick={() => setSelectedBranchID(item.branchID)}
                          >
                            {store.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={decreaseQty}
                        className="cursor-pointer"
                      >
                        -
                      </Button>
                      <div className="px-4">{quantity}</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={increaseQty}
                        className="cursor-pointer"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {renderButtons()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProductSection;
