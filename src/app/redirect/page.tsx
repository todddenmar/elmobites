"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import _ from "lodash";

const isInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram/.test(ua);
};

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function SignInRedirectPage() {
  const param = useParams();
  const [isInApp, setIsInApp] = useState(false);
  const destinationURL =
    process.env.NODE_ENV === "development"
      ? "/sign-in"
      : "https://eventracers.com/sign-in";
  const eventSlug = Array.isArray(param.slug) ? param.slug[0] : param.slug;

  useEffect(() => {
    if (isInAppBrowser()) {
      setIsInApp(true);
    } else {
      // Open directly if not in in-app browser
      window.location.href = destinationURL;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = () => {
    if (isAndroid()) {
      window.location.href = `intent://${destinationURL.replace(
        /^https?:\/\//,
        ""
      )}#Intent;scheme=https;package=com.android.chrome;end;`;
    } else if (isIOS()) {
      // Safer for iOS
      window.open(destinationURL, "_blank", "noopener,noreferrer");
    } else {
      window.open(destinationURL, "_blank", "noopener,noreferrer");
    }
  };

  if (!isInApp) return null;

  return (
    <div className="flex items-center justify-center min-h-screen  px-4 text-center">
      <div className="max-w-md bg-white/5 border rounded-xl shadow p-6 space-y-4">
        <div className="text-xl font-semibold">{_.startCase(eventSlug)}</div>
        <div className="flex items-end gap-4">
          <Image
            src={"/images/thinking-avatar.png"}
            alt="facebook thinking avatar"
            width={200}
            height={200}
          />{" "}
          <div>
            <div className="bg-white/10 rounded-3xl rounded-bl-none p-4 flex flex-col items-center justify-center">
              <p className="text-sm">
                Hmm... it seems you&apos;re currently in Facebook or
                Instagram&apos;s in-app browser.
              </p>
            </div>
            <div className="h-[40px]"></div>
          </div>
        </div>
        <button
          className="bg-red-500 font-semibold px-4 text-sm py-2 rounded-lg"
          onClick={handleOpen}
        >
          Continue in External Browser
        </button>
      </div>
    </div>
  );
}
