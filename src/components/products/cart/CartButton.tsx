import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { pluralize, convertCurrency } from "@/lib/utils";
import CartItem from "./CartItem";
import Link from "next/link";

type CartButtonProps = {
  isContinue?: boolean;
};

function CartButton({ isContinue }: CartButtonProps) {
  const { customerCart, isOpenCart, setIsOpenCart } = useAppStore();
  const cartItemsTotal = customerCart?.items.length || 0;

  const cartTotal =
    customerCart?.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;
  useEffect(() => {
    if (cartTotal === 0) {
      setIsOpenCart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotal]);
  return (
    <div>
      <Sheet open={isOpenCart} onOpenChange={setIsOpenCart}>
        <SheetTrigger asChild>
          {isContinue ? (
            <Button className="w-full cursor-pointer" type="button" size="lg">
              Continue To Cart
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="relative"
            >
              <ShoppingCartIcon />
              {cartItemsTotal > 0 ? (
                <Badge className="absolute -top-2 -right-2 rounded-full aspect-square">
                  {cartItemsTotal}
                </Badge>
              ) : null}
            </Button>
          )}
        </SheetTrigger>

        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
            <SheetDescription>
              {pluralize({
                number: cartItemsTotal,
                plural: "items",
                singular: "item",
              })}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 p-4 h-full flex flex-col gap-4 text-sm">
            {/* Cart Items */}
            <div className="flex flex-col flex-1 gap-2 ">
              {customerCart?.items.map((item) => (
                <CartItem key={`cart-item-${item.id}`} cartItem={item} />
              ))}
            </div>
            {/* Cart Total */}
            <div className="border-t pt-4 flex justify-between items-center">
              <span>Total: {convertCurrency(cartTotal)}</span>
              {cartTotal > 0 ? (
                <Link href={"/checkout"} onClick={() => setIsOpenCart(false)}>
                  <Button type="button">Checkout</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CartButton;
