import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import ImageContainer from "../custom-ui/ImageContainer";

interface IProductPageGalleryProps {
  imageURLs: string[];
}

function ProductPageGallery({ imageURLs }: IProductPageGalleryProps) {
  if (imageURLs.length === 1) {
    return (
      <ImageContainer className="w-full aspect-square lg:rounded-lg">
        <Image
          src={imageURLs[0]}
          alt={`product-image`}
          width={1000}
          height={1000}
          className="h-full w-full object-cover object-center"
          style={{
            overflowClipMargin: "unset",
          }}
        />
      </ImageContainer>
    );
  }
  return (
    <div>
      <div className="block md:hidden">
        <Carousel className="w-full relative">
          <CarouselContent>
            {imageURLs?.map((item, idx) => {
              return (
                <CarouselItem key={`carousel-item-${idx}`}>
                  <ImageContainer className="w-full aspect-square  ">
                    <Image
                      src={item}
                      alt={`mobile-image-${idx}`}
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-center"
                      style={{
                        overflowClipMargin: "unset",
                      }}
                    />
                  </ImageContainer>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
      <div className="hidden md:grid grid-cols-1 md:gap-4 lg:gap-6">
        <Carousel className="w-full relative">
          <CarouselContent>
            {imageURLs?.map((item, idx) => {
              return (
                <CarouselItem
                  key={`carousel-item-${idx}`}
                  className="basis-2/3 relative"
                >
                  <ImageContainer className="w-full aspect-square rounded-lg">
                    <Image
                      src={item}
                      alt={`desktop-image-${idx}`}
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-center rounded-lg"
                      style={{
                        overflowClipMargin: "unset",
                      }}
                    />
                  </ImageContainer>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
}

export default ProductPageGallery;
