"use client";
import React from "react";
import { TProduct, TProductCategory } from "@/typings";
import ProductPageGallery from "./ProductPageGallery";
import { useSearchParams } from "next/navigation";
import { cn, convertCurrency } from "@/lib/utils";
import EmptyLayout from "../custom-ui/EmptyLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCartIcon } from "lucide-react";
type ProductSectionProps = {
  product: TProduct;
  category: TProductCategory | null;
  isPage?: boolean;
};
function ProductSection({ product, category }: ProductSectionProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("variant");
  const selectedVariant = searchQuery
    ? product.variants.find((item) => item.id === searchQuery) ||
      product.variants[0]
    : product.variants[0];

  if (!selectedVariant) {
    return <EmptyLayout>No Variant For this Product</EmptyLayout>;
  }

  return (
    <div>
      <div className="px-4 py-2 lg:mx-auto lg:max-w-7xl sticky top-0 left-0 right-0 bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto lg:max-w-7xl lg:p-4 lg:gap-4">
        <div>
          <ProductPageGallery
            imageURLs={
              selectedVariant?.imageURLs?.map((item) => item) ||
              product.images.map((item) => item.url) ||
              []
            }
          />
        </div>
        <div className="rounded-t-2xl -mt-4 lg:-mt-0 z-10 p-0 pt-4 lg:p-4 relative bg-white">
          <div
            className={cn(
              "w-full group relative p-4 rounded-lg flex flex-col justify-center"
            )}
          >
            <div className="relative z-20 space-y-2 lg:space-y-4 flex flex-col h-full flex-1 ">
              <div className="flex-1">
                <div className="font-accent uppercase text-3xl leading-6 lg:leading-10 lg:text-5xl">
                  {product.name}
                </div>
                {category ? (
                  <div className="font-signature text-4xl lg:text-6xl -mt-2 lg:-mt-4 ml-5">
                    {category?.name}
                  </div>
                ) : null}
              </div>
              <div className="space-y-4">
                <p className="uppercase font-secondary text-xs lg:text-lg">
                  {product.description}
                </p>
                <div className="text-2xl">
                  {convertCurrency(selectedVariant.price)}
                </div>
                <div className="flex items-center flex-wrap gap-4 text-sm lg:text-xl font-secondary font-medium">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant.id;
                    return (
                      <Link
                        key={`variant-${variant.id}`}
                        href={`/products/${product.slug}?variant=${variant.id}`}
                      >
                        <Button
                          type="button"
                          className="cursor-pointer"
                          variant={isSelected ? "default" : "outline"}
                        >
                          {variant.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="w-full cursor-pointer"
                    type="button"
                    size={"lg"}
                    variant={"outline"}
                  >
                    <ShoppingCartIcon /> Add To Cart
                  </Button>
                  <Button
                    className="w-full cursor-pointer"
                    type="button"
                    size={"lg"}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;
