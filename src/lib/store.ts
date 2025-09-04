import { TGoogleUser, TProduct, TStore, TUser } from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  googleUser: TGoogleUser | null;
  userData: TUser | null;
  currentStores: TStore[];
  currentProducts: TProduct[];
};

export type TAppStoreActions = {
  setGoogleUser: (googleUser: TGoogleUser | null) => void;
  setUserData: (userData: TUser | null) => void;
  setCurrentStores: (currentStores: TStore[]) => void;
  setCurrentProducts: (currentProducts: TProduct[]) => void;
};
export const useAppStore = create<TAppStoreStates & TAppStoreActions>(
  (set) => ({
    googleUser: null,
    setGoogleUser: (googleUser) => set(() => ({ googleUser })),
    userData: null,
    setUserData: (userData) => set(() => ({ userData })),
    currentStores: [],
    setCurrentStores: (currentStores) => set(() => ({ currentStores })),
    currentProducts: [],
    setCurrentProducts: (currentProducts) => set(() => ({ currentProducts })),
  })
);
