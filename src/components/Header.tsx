"use client";
import React, { useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchCollectionWhere, dbSetDocument } from "@/lib/firebase/actions";
import { TUser } from "@/typings";
import { useAppStore } from "@/lib/store";
import CompanyLogo from "./CompanyLogo";
import { ShieldIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import AdminMobileMenu from "./admin/AdminMobileMenu";

function Header() {
  const { setUserData, userData } = useAppStore();
  const pathname = usePathname();
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS!;
  const isAdmin = userData ? adminEmails.includes(userData?.email) : false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        getPrivateData(firebaseUser);
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        console.log({ userResult });
        if (userResult.data) {
          console.log("get user  data");
          // getEventRaceCategories({ eventID: userResult.data.currentEventID });
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
            currentEventID: userData.currentEventID,
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
          {isAdmin ? (
            <Link href={"/admin"}>
              <ShieldIcon size={18} />
            </Link>
          ) : null}
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
