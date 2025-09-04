"use client";
import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Button } from "./ui/button";
import { auth } from "@/firebase";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  LoaderIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ToastAlert from "./custom-ui/ToastAlert";
import AnonymousLoginButton from "./AnonymousLoginButton";
const isInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram/.test(ua);
};
function GoogleLoginButton() {
  const { setGoogleUser, googleUser, setUserData } = useAppStore();
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [isLoading, setIsLoading] = useState(true);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setGoogleUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "No name",
          email: firebaseUser.email || "No Email",
          photoURL: firebaseUser.photoURL || null,
        });
      } else {
        setGoogleUser(null);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        if (user) {
          setGoogleUser({
            uid: user.uid,
            displayName: user.displayName || "No name",
            email: user.email || "No Email",
            photoURL: user.photoURL || null,
          });
        }
      })
      .catch((error) => {
        if (error.code === "auth/popup-blocked") {
          toast.custom(() =>
            event ? (
              <ToastAlert
                icon={<AlertCircleIcon />}
                title="Browser Error"
                description={
                  <div className="flex flex-col items-center gap-2">
                    <div>You are using facebook in-app browser</div>
                    <Link href={`/`}>click this link to redirect</Link>
                  </div>
                }
              />
            ) : (
              <ToastAlert
                icon={<AlertCircleIcon />}
                title="Browser Error"
                description={
                  <div>
                    You are using facebook in-app browser please use
                    chrome/safari
                  </div>
                }
              />
            )
          );
          return;
        }
        toast.error(error.message);
        console.log({ error });
      });
  };

  const onLogout = async () => {
    const auth = getAuth();
    setUserData(null);
    signOut(auth)
      .then(() => {
        setGoogleUser(null);
        setUserData(null);
        router.push("/");
        toast.success("Signed out successfully!");
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  if (isLoading) {
    return <LoaderIcon className="animate-spin text-orange-500" />;
  }
  return (
    <div>
      {googleUser ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-[32px] flex flex-col items-center justify-center cursor-pointer hover:animate-pulse w-[32px] relative overflow-hidden rounded-full border">
                {googleUser.photoURL ? (
                  <Image
                    src={googleUser.photoURL}
                    alt={googleUser.displayName}
                    width={50}
                    height={50}
                  />
                ) : (
                  <UserIcon size={16} className="text-orange-500" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="capitalize">
                {googleUser.displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <Button className="w-full" onClick={() => setIsSignInOpen(true)}>
            Sign In
          </Button>
          <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome to The Cake Co.</DialogTitle>
                <DialogDescription>
                  Please choose how you want to sign in.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-2">
                {isInAppBrowser() ? (
                  <AnonymousLoginButton />
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      onLogin();
                      setIsSignInOpen(false);
                    }}
                  >
                    As a Customer
                  </Button>
                )}

                <Link href={"/redirect"}>
                  <Button
                    className="w-full"
                    variant={"link"}
                    onClick={() => {
                      setIsSignInOpen(false);
                    }}
                  >
                    As a Admin
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default GoogleLoginButton;
