import React from "react";
import { Button } from "../ui/button";

function Banner() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-10 p-4">
        <h1 className="font-main text-6xl md:text-8xl lg:text-9xl">
          The Cake Co.
        </h1>
        <Button
          size={"lg"}
          className="rounded-full cursor-pointer"
          type="button"
        >
          Order Now
        </Button>
      </div>
    </div>
  );
}

export default Banner;
