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

function Header() {
  const { setUserData } = useAppStore();

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
    <div className="flex justify-between items-center gap-4 p-4">
      <Link href={"/"}>
        <CompanyLogo />
      </Link>
      <GoogleLoginButton />
    </div>
  );
}

export default Header;
