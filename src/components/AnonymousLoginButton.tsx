"use client";
import React, { useState } from "react";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from "firebase/auth";
import { Button } from "./ui/button";
import { useAppStore } from "@/lib/store";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

function AnonymousLoginButton() {
  const { setGoogleUser } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const onLogin = async () => {
    if (!name) {
      toast.error("Name required");
      return;
    }
    if (!email) {
      toast.error("Email address required");
      return;
    }
    const auth = getAuth();
    await setPersistence(auth, browserSessionPersistence);
    await signInAnonymously(auth)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        // Signed in..
        setGoogleUser({
          displayName: name || "Anonymous Login",
          email: email || "anonymous@gmail.com",
          uid: uid,
          photoURL: null,
        });
        toast.success("You are now signed in!");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ...
      });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Label>Name</Label>
          <Input value={name} onChange={(val) => setName(val.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label>Email Address</Label>
          <Input value={email} onChange={(val) => setEmail(val.target.value)} />
        </div>
      </div>
      <Button type="button" className="w-full" onClick={onLogin}>
        Login Anonymously
      </Button>
    </div>
  );
}

export default AnonymousLoginButton;
