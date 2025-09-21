"use client";
import React, { useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
  dbFetchDocument,
  dbSetDocument,
} from "@/lib/firebase/actions";
import {
  TProduct,
  TProductCategory,
  TStore,
  TInventory,
  TUser,
  TOrder,
  TSettings,
  TEmployee,
} from "@/typings";
import { useAppStore } from "@/lib/store";
import CompanyLogo from "./CompanyLogo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import AdminMobileMenu from "./admin/AdminMobileMenu";
import CartButton from "./products/cart/CartButton";
import { collection, onSnapshot, query } from "firebase/firestore";

function Header() {
  const {
    setUserData,
    setCurrentStores,
    setCurrentProducts,
    setCurrentProductCategories,
    setCurrentInventory,
    setCurrentActiveOrders,
    setCurrentSettings,
    setCurrentEmployees,
  } = useAppStore();
  const pathname = usePathname();
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS!;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        getPrivateData(firebaseUser);
        const isAdmin = firebaseUser?.email
          ? adminEmails.includes(firebaseUser?.email)
          : false;
        if (isAdmin) {
          getAdminData();
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSettingsData = async () => {
      const res = await dbFetchDocument(DB_COLLECTION.SETTINGS, "general");
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
        return;
      }
      if (res.data) {
        const settingsData = res.data as TSettings;
        setCurrentSettings(settingsData);
      }
    };
    fetchSettingsData();
    const fetchStores = async () => {
      const res = await dbFetchCollection(DB_COLLECTION.STORES);
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
        return;
      }
      if (res.data) {
        const stores = res.data as TStore[];
        setCurrentStores(stores);
      }
    };
    fetchStores();
    const fetchProducts = async () => {
      const res = await dbFetchCollection(DB_COLLECTION.PRODUCTS);
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
        return;
      }
      if (res.data) {
        const products = res.data as TProduct[];
        setCurrentProducts(products);
      }
    };
    fetchProducts();
    const fetchProductCategories = async () => {
      const res = await dbFetchCollection(DB_COLLECTION.PRODUCT_CATEGORIES);
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.log(res.message);
        return;
      }
      if (res.data) {
        const categories = res.data as TProductCategory[];
        setCurrentProductCategories(categories);
      }
    };
    fetchProductCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ref = collection(db, DB_COLLECTION.INVENTORY);
    const q = query(ref);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventory: TInventory[] = [];
      querySnapshot.forEach((doc) => {
        inventory.push(doc.data() as TInventory);
      });
      setCurrentInventory(inventory);
    });
    return () => unsubscribe(); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAdminData = async () => {
    const res = await dbFetchCollectionWhere({
      collectionName: DB_COLLECTION.ORDERS,
      fieldName: "status",
      fieldValue: "COMPLETED",
      operation: "!=",
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    if (res.data) {
      const activeOrders = res.data as TOrder[];
      setCurrentActiveOrders(activeOrders);
    }

    const resEmployees = await dbFetchCollection(DB_COLLECTION.EMPLOYEES);
    if (resEmployees.status === DB_METHOD_STATUS.ERROR) {
      console.log(resEmployees.message);
      return;
    }
    if (resEmployees.data) {
      setCurrentEmployees((resEmployees.data as TEmployee[]) || []);
    }
  };

  const getPrivateData = async (user: User) => {
    if (user?.email) {
      const userResult = await dbFetchCollectionWhere({
        collectionName: DB_COLLECTION.USERS,
        fieldName: "email",
        fieldValue: user.email,
        operation: "==",
      });
      if (userResult.status === DB_METHOD_STATUS.SUCCESS) {
        console.log("get user results");
        if (userResult.data) {
          console.log("get user  data");
          const userData = userResult.data[0] as TUser;
          if (!userData) {
            createNewUser({
              id: user.uid,
              email: user?.email,
              firstname: user?.displayName?.split(" ")[0] || "",
              lastname: user?.displayName?.split(" ")[1] || "",
            });
            return;
          }
          setUserData({
            id: userData.id,
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
          });
        }
      }
    }
  };

  const createNewUser = async ({
    id,
    email,
    firstname,
    lastname,
  }: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  }) => {
    console.log("Creating new user");
    const newUserData: TUser = {
      id: id,
      email: email,
      firstname: firstname || "",
      lastname: lastname || "",
    };
    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.USERS,
      data: newUserData,
      id: newUserData.id,
    });
    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      setUserData(newUserData);
    } else {
      console.log({ errorMessage: res.message });
    }
  };
  return (
    <div>
      <div
        className={cn(
          "flex justify-between items-center gap-4 p-4 max-w-7xl w-full mx-auto",
          pathname.includes("/admin") ? "max-w-screen" : ""
        )}
      >
        <div className="flex items-center gap-4">
          {pathname.includes("/admin") ? <AdminMobileMenu /> : null}
          <Link href={"/"}>
            <CompanyLogo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <CartButton />
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
