import { CardShineEffect } from "@/components/custom-ui/CardShineEffect";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
} from "@/lib/firebase/actions";
import { convertCurrency } from "@/lib/utils";
import { TProduct, TProductCategory } from "@/typings";
import { Metadata } from "next";
import Image from "next/image";

const getProductsData = async () => {
  let products: TProduct[] = [];
  let categories: TProductCategory[] = [];
  const res = await dbFetchCollectionWhere({
    collectionName: DB_COLLECTION.PRODUCTS,
    fieldName: "isPublished",
    fieldValue: true,
    operation: "==",
  });
  if (res.status === DB_METHOD_STATUS.SUCCESS) {
    products = res.data as TProduct[];
  }
  const resCategory = await dbFetchCollection(DB_COLLECTION.PRODUCT_CATEGORIES);
  if (resCategory.status === DB_METHOD_STATUS.SUCCESS) {
    categories = resCategory.data as TProductCategory[];
  }
  return {
    products,
    categories,
  };
};

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const data = await getProductsData();

  if (!data) {
    return {
      title: "Prodcuts not found | The Cake Co.",
      description: "Our cakes will be available soon.",
    };
  }

  return {
    title: `The Cake Co. Products`,
    description: `Order delicious custom cakes online from The Cake Co. Pagadian City. Freshly baked, beautifully designed, and delivered straight to your doorstep!`,
    other: {
      "google-adsense-account": "ca-pub-1826892933379008",
    },
  };
}

const ProductsPage = async () => {
  const data = await getProductsData();
  const { products, categories } = data;
  if (!data) {
    return (
      <ErrorCard
        title="There are no products yet"
        description="Our cakes will be available soon."
        linkText="Go back to homepage"
        redirectionLink="/"
      />
    );
  }
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {products.map((item) => {
          const category = categories.find((c) => c.id === item.categoryID);
          return (
            <div
              key={`product-item-${item.id}`}
              className="w-full group border relative p-4 rounded-lg lg:p-8 flex flex-col justify-center"
            >
              <div className="relative z-20 max-w-2/3 lg:max-w-sm space-y-2 lg:space-y-4 flex flex-col h-full flex-1 ">
                <div className="flex-1">
                  <div className="font-accent uppercase text-2xl leading-5 lg:leading-10 lg:text-5xl">
                    {item.name}
                  </div>
                  {category ? (
                    <div className="font-signature text-4xl lg:text-6xl -mt-4 ml-5">
                      {category?.name}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-4">
                  <p className="uppercase font-secondary text-xs lg:text-lg">
                    {item.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 text-sm lg:text-xl font-secondary font-medium">
                    {item.variants.map((variant, idx) => {
                      return (
                        <div
                          key={`variant-${variant.id}`}
                          className="flex items-center gap-2"
                        >
                          {idx === 0 ? null : "/"}
                          <span>
                            {`${convertCurrency(variant.price)} ${
                              variant.name
                            }`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {item.thumbnailImage ? (
                <div className="absolute right-0 top-0 p-4 w-[150px] h-full lg:w-[200px] z-10">
                  <CardShineEffect />
                  <Image
                    src={item.thumbnailImage}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
