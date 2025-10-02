"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { useAppStore } from "@/lib/store";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

function OrganizerSignInPage() {
  const { userData } = useAppStore();
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const onLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success(`Welcome ${user.displayName}`);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log({ error });
      });
  };
  useEffect(() => {
    if (userData) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  return (
    <div className="h-[600px] w-full flex flex-col items-center justify-center">
      <div className="p-4 rounded-lg bg-white/5/5 border space-y-4">
        <div>
          <h4 className="font-semibold text-lg">Admin Sign In</h4>
          <p className="text-muted-foreground text-sm">
            Admins are required to login via google
          </p>
        </div>
        <Button className="w-full" type="button" onClick={onLogin}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default OrganizerSignInPage;
