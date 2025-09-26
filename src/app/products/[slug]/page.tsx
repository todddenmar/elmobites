"use client";

import { useEffect, useState } from "react";
import ProductSection from "@/components/products/ProductSection";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollectionWhere,
  dbFetchDocument,
} from "@/lib/firebase/actions";
import { TProduct, TProductCategory } from "@/typings";
import { useParams } from "next/navigation";
import LoadingCard from "@/components/custom-ui/LoadingCard";

const ProductPage = () => {
  const params = useParams();
  const productSlug = params.slug as string;
  const [product, setProduct] = useState<TProduct | null>(null);
  const [category, setCategory] = useState<TProductCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductDataBySlug = async () => {
      let product: TProduct | null = null;
      let category: TProductCategory | null = null;

      const res = await dbFetchCollectionWhere({
        collectionName: DB_COLLECTION.PRODUCTS,
        fieldName: "slug",
        fieldValue: productSlug,
        operation: "==",
      });

      if (res.status === DB_METHOD_STATUS.SUCCESS && res.data?.[0]) {
        const productData = res.data[0] as TProduct;
        product = {
          ...productData,
          timestamp: productData.timestamp.toString(),
        };
      }
      if (product?.categoryID) {
        const resCategory = await dbFetchDocument(
          DB_COLLECTION.PRODUCT_CATEGORIES,
          product.categoryID
        );
        if (
          resCategory.status === DB_METHOD_STATUS.SUCCESS &&
          resCategory.data
        ) {
          category = resCategory.data as TProductCategory;
          setCategory(category);
        }
      }

      setProduct(product);
      setLoading(false);
    };

    if (productSlug) {
      getProductDataBySlug();
    } else {
      setLoading(false);
    }
  }, [productSlug]);

  if (loading) {
    return (
      <LoadingCard
        title="Loading product"
        description="You are trying to view a product page."
        linkText="Go back to the products page"
        redirectionLink="/products"
      />
    );
  }

  if (!product) {
    return (
      <LoadingCard
        title="Looking for the product"
        description="You are trying to view a product page."
        linkText="Go back to the products page"
        redirectionLink="/products"
      />
    );
  }

  return <ProductSection product={product} category={category} />;
};

export default ProductPage;
