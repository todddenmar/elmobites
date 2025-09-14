"use client";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import ProductCard from "@/components/products/ProductCard";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
} from "@/lib/firebase/actions";
import { TProduct, TProductCategory } from "@/typings";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TProductCategory[]>([]);
  useEffect(() => {
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
      const resCategory = await dbFetchCollection(
        DB_COLLECTION.PRODUCT_CATEGORIES
      );
      if (resCategory.status === DB_METHOD_STATUS.SUCCESS) {
        categories = resCategory.data as TProductCategory[];
      }
      setProducts(products || []);
      setCategories(categories || []);
    };
    getProductsData();
  }, []);

  if (!products) {
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
    <div>
      <div className="px-4 py-2 lg:mx-auto lg:max-w-7xl sticky top-0 left-0 right-0 bg-white z-30">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full p-4 lg:mx-auto lg:max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {products.map((item) => {
            const category = categories.find((c) => c.id === item.categoryID);
            return (
              <Link
                key={`product-item-${item.id}`}
                href={`/products/${item.slug}`}
              >
                <ProductCard product={item} category={category || null} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
