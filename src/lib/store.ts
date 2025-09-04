import { TGoogleUser, TUser } from "@/typings";
import { create } from "zustand";

export type TAppStoreStates = {
  googleUser: TGoogleUser | null;
  userData: TUser | null;
};

export type TAppStoreActions = {
  setGoogleUser: (googleUser: TGoogleUser | null) => void;
  setUserData: (userData: TUser | null) => void;
};
export const useAppStore = create<TAppStoreStates & TAppStoreActions>(
  (set) => ({
    googleUser: null,
    setGoogleUser: (googleUser) => set(() => ({ googleUser })),
    userData: null,
    setUserData: (userData) => set(() => ({ userData })),
  })
);
