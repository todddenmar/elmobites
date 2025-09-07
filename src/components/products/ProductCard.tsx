import { cn, convertCurrency } from "@/lib/utils";
import { TProduct, TProductCategory } from "@/typings";
import React from "react";
import { CardShineEffect } from "../custom-ui/CardShineEffect";
import Image from "next/image";

type ProductCardProps = {
  product: TProduct;
  category: TProductCategory | null;
  isPage?: boolean;
};
function ProductCard({ product, category, isPage }: ProductCardProps) {
  return (
    <div
      className={cn(
        "w-full group relative p-4 rounded-lg lg:p-8 flex flex-col justify-center",
        isPage ? "" : "border"
      )}
    >
      <div className="relative z-20 max-w-2/3 lg:max-w-sm space-y-2 lg:space-y-4 flex flex-col h-full flex-1 ">
        <div className="flex-1">
          <div className="font-accent uppercase text-2xl leading-5 lg:leading-10 lg:text-5xl">
            {product.name}
          </div>
          {category ? (
            <div className="font-signature text-4xl lg:text-6xl -mt-3 lg:-mt-4 ml-5">
              {category?.name}
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <p className="uppercase font-secondary text-xs lg:text-lg">
            {product.description}
          </p>
          <div className="flex items-center flex-wrap gap-2 text-sm lg:text-xl font-secondary font-medium">
            {product.variants.map((variant, idx) => {
              return (
                <div
                  key={`variant-${variant.id}`}
                  className="flex items-center gap-2"
                >
                  {idx === 0 ? null : "/"}
                  <span>
                    {`${convertCurrency(variant.price)} ${variant.name}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {product.thumbnailImage ? (
        <div className="absolute right-0 top-0 p-4 w-[150px] h-full lg:w-[200px] z-10">
          <CardShineEffect />
          <Image
            src={product.thumbnailImage}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover h-full w-full"
          />
        </div>
      ) : null}
    </div>
  );
}

export default ProductCard;
