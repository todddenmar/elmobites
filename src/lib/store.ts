import {
  TGoogleUser,
  TProduct,
  TProductCategory,
  TStore,
  TInventory,
  TUser,
  TCart,
  TOrder,
  TSettings,
} from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  googleUser: TGoogleUser | null;
  userData: TUser | null;
  isOpenCart: boolean;
  customerCart: TCart | null;
  currentStores: TStore[];
  currentProducts: TProduct[];
  currentProductCategories: TProductCategory[];
  currentInventory: TInventory[];
  currentActiveOrders: TOrder[];
  currentSettings: TSettings;
};

export type TAppStoreActions = {
  setGoogleUser: (googleUser: TGoogleUser | null) => void;
  setUserData: (userData: TUser | null) => void;
  setIsOpenCart: (isOpenCart: boolean) => void;
  setCustomerCart: (customerCart: TCart | null) => void;
  setCurrentStores: (currentStores: TStore[]) => void;
  setCurrentProducts: (currentProducts: TProduct[]) => void;
  setCurrentProductCategories: (
    currentProductCategories: TProductCategory[]
  ) => void;
  setCurrentInventory: (currentInventory: TInventory[]) => void;
  setCurrentActiveOrders: (currentInventory: TOrder[]) => void;
  setCurrentSettings: (currentSettings: TSettings) => void;
};
export const useAppStore = create<TAppStoreStates & TAppStoreActions>(
  (set) => ({
    googleUser: null,
    setGoogleUser: (googleUser) => set(() => ({ googleUser })),
    userData: null,
    setUserData: (userData) => set(() => ({ userData })),
    isOpenCart: false,
    setIsOpenCart: (isOpenCart) => set(() => ({ isOpenCart })),
    customerCart: null,
    setCustomerCart: (customerCart) => set(() => ({ customerCart })),
    currentStores: [],
    setCurrentStores: (currentStores) => set(() => ({ currentStores })),
    currentProducts: [],
    setCurrentProducts: (currentProducts) => set(() => ({ currentProducts })),
    currentProductCategories: [],
    setCurrentProductCategories: (currentProductCategories) =>
      set(() => ({ currentProductCategories })),
    currentInventory: [],
    setCurrentInventory: (currentInventory) =>
      set(() => ({ currentInventory })),
    currentActiveOrders: [],
    setCurrentActiveOrders: (currentActiveOrders) =>
      set(() => ({ currentActiveOrders })),
    currentSettings: {
      deliveryFee: 50,
      paymentOptions: [],
      updatedAt: new Date().toISOString(),
      images: [],
    },
    setCurrentSettings: (currentSettings) => set(() => ({ currentSettings })),
  })
);
