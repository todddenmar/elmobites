"use client";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { useAppStore } from "@/lib/store";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

function OrganizerSignInPage() {
  const { userData } = useAppStore();
  console.log({ userData });
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
      <div className="p-4 rounded-lg bg-white/5 border space-y-4">
        <SectionTitle>Organizer Sign In</SectionTitle>
        <p className="text-muted-foreground">
          Organizers are required to login via google
        </p>
        <Button className="w-full" type="button" onClick={onLogin}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default OrganizerSignInPage;
