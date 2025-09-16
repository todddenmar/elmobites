"use client";
import AddProductMediaDialog from "@/components/admin/products/forms/AddProductMediaDialog";
import CarouselImageCard from "@/components/custom-ui/CarouselImageCard";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbUpdateDocument,
  deleteMediaFromStorage,
} from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import { TMediaFile, TProduct } from "@/typings";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { TypographyH4 } from "@/components/custom-ui/typography";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { convertCurrency } from "@/lib/utils";
import SelectVariantImagesDialog from "@/components/admin/products/forms/SelectVariantImagesDialog";
function AdminProductPage() {
  const params = useParams();
  const productID = params.id as string;
  const { currentProducts, setCurrentProducts } = useAppStore();
  const [product, setProduct] = useState<TProduct | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<TMediaFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(currentProducts)) {
      const res = currentProducts.find((item) => item.id === productID);
      if (res) setProduct(res);
    }
  }, [currentProducts, productID]);

  const onUpdateThumbnail = async (url: string) => {
    if (!product) return;
    const resProduct = await dbUpdateDocument(
      DB_COLLECTION.PRODUCTS,
      product.id,
      {
        thumbnailImage: url,
      }
    );
    if (resProduct.status === DB_METHOD_STATUS.ERROR) {
      console.log(resProduct.message);
      setIsLoading(false);
      return;
    }
    const updatedProduct = { ...product, thumbnailImage: url };
    const updatedProducts = currentProducts.map((item) =>
      item.id === product.id ? updatedProduct : item
    );
    setCurrentProducts(updatedProducts);
    toast.success("Selected as thumbnail");
  };

  const onRemove = async () => {
    if (!product) return;
    if (!selectedImage) return;

    setIsLoading(true);

    const res = await deleteMediaFromStorage(
      `products/${product.id}/${selectedImage.id}`
    );
    if (res?.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      setIsLoading(false);
      return;
    }

    const updated = product?.images.filter((item) => item != selectedImage);
    const resProduct = await dbUpdateDocument(
      DB_COLLECTION.PRODUCTS,
      product.id,
      {
        images: updated,
      }
    );
    if (resProduct.status === DB_METHOD_STATUS.ERROR) {
      console.log(resProduct.message);
      setIsLoading(false);
      return;
    }
    const updatedProduct = { ...product, images: updated };
    const updatedProducts = currentProducts.map((item) =>
      item.id === product.id ? updatedProduct : item
    );
    setCurrentProducts(updatedProducts);
    toast.success("Image removed");
    setIsOpenConfirm(false);
    setSelectedImage(null);
    setIsLoading(false);
  };

  if (!product) return <EmptyLayout>No Product</EmptyLayout>;

  if (!product) return <EmptyLayout>Product Not Found</EmptyLayout>;
  return (
    <div className="flex flex-col gap-4 flex-1 h-full bg-white p-4 rounded-lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center">
        <SectionTitle>{product?.name}</SectionTitle>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <TypographyH4>Gallery</TypographyH4>
        {product.images.length === 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
            <Skeleton className="w-full aspect-[3/4] h-full" />
          </div>
        ) : null}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {product.images
            .map((item, idx) => {
              const key = `prev-image-${idx}`;
              const url = item.url;
              return (
                <div key={key}>
                  <CarouselImageCard
                    onClickDelete={() => {
                      setIsOpenConfirm(true);
                      setSelectedImage(item);
                    }}
                    onClickThumbnail={() => {
                      onUpdateThumbnail(url);
                    }}
                    onClickImage={() => {
                      console.log("image clicked");
                    }}
                    isThumbnail={product.thumbnailImage === item.url}
                    alt={key}
                    src={url}
                  />
                </div>
              );
            })
            .reverse()}
        </div>
        <AddProductMediaDialog product={product} />
      </div>

      <div className="space-y-4">
        <TypographyH4>Product Variants</TypographyH4>

        <div className="space-y-4">
          {product.variants.map((item) => {
            const thumbnailImage = item.thumbnailImage;
            return (
              <div
                key={`variant-${item.id}`}
                className="space-y-4 border p-4 rounded-lg"
              >
                <div className="flex gap-2 text-sm">
                  <div className="w-[50px] flex flex-col items-center justify-center border aspect-square relative overflow-hidden rounded-lg">
                    {thumbnailImage ? (
                      <Image
                        src={thumbnailImage}
                        width={50}
                        height={50}
                        className="object-cover object-center"
                        alt={item.name}
                      />
                    ) : (
                      <ImageIcon size={18} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div>{convertCurrency(item.price)}</div>
                  </div>
                </div>
                <SelectVariantImagesDialog variant={item} product={product} />
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isOpenConfirm} onOpenChange={setIsOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              image.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setIsOpenConfirm(false)}
                type="button"
                variant={"destructive"}
              >
                Cancel
              </Button>
              <Button onClick={onRemove} type="button">
                Confirm
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProductPage;
