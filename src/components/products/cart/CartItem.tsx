"use client";
import React from "react";
import { TCart, TCartItem, TInventory } from "@/typings";
import { convertCurrency } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Trash2Icon } from "lucide-react";

type CartItemProps = {
  cartItem: TCartItem;
};

function CartItem({ cartItem }: CartItemProps) {
  const {
    currentStores,
    customerCart,
    setCustomerCart,
    currentInventory,
    setCurrentInventory,
  } = useAppStore();
  const subtotal = cartItem.price * cartItem.quantity;
  const store = currentStores.find((s) => s.id === cartItem.branchID);

  const onRemoveFromCart = () => {
    if (!customerCart) return;
    // restore inventory stock
    const updatedInventory = currentInventory.map((inv) => {
      if (
        inv.branchID === cartItem.branchID &&
        inv.productID === cartItem.productID &&
        inv.variantID === cartItem.variantID
      ) {
        return {
          ...inv,
          stock: inv.stock + cartItem.quantity, // restore the removed stock
        };
      }
      return inv;
    }) as TInventory[];

    setCurrentInventory(updatedInventory);
    const updatedItems = customerCart.items.filter(
      (item) => item.id !== cartItem.id
    );

    const newCart: TCart = {
      ...customerCart,
      items: updatedItems,
      subtotal: updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      total: updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      updatedAt: new Date().toISOString(),
    };

    setCustomerCart(newCart);
  };
  return (
    <div className="flex justify-between items-center border-b py-2 relative">
      <div className="flex flex-col w-full">
        <span className="text-xs">{store?.name}</span>
        <span className="font-medium">{cartItem.name}</span>
        <span className="text-sm text-muted-foreground">
          {cartItem.variantName} x {cartItem.quantity}
        </span>
      </div>
      <div className="text-right">{convertCurrency(subtotal)}</div>
      <button
        onClick={onRemoveFromCart}
        type="button"
        className="absolute top-2 right-0"
      >
        <Trash2Icon size={12} />
      </button>
    </div>
  );
}

export default CartItem;
