import { TStore } from "@/typings";
import React from "react";

type StoreActionButtonProps = {
  storeData: TStore;
};
function StoreActionButton({ storeData }: StoreActionButtonProps) {
  return <div>{storeData.name}</div>;
}

export default StoreActionButton;
