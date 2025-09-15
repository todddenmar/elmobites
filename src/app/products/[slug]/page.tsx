"use client";

import { useEffect, useState } from "react";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import ProductSection from "@/components/products/ProductSection";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
} from "@/lib/firebase/actions";
import { TProduct, TProductCategory } from "@/typings";
import { useParams } from "next/navigation";

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

      const resCategory = await dbFetchCollection(
        DB_COLLECTION.PRODUCT_CATEGORIES
      );
      if (
        resCategory.status === DB_METHOD_STATUS.SUCCESS &&
        resCategory.data?.[0]
      ) {
        category = resCategory.data[0] as TProductCategory;
      }

      setProduct(product);
      setCategory(category);
      setLoading(false);
    };

    if (productSlug) {
      getProductDataBySlug();
    } else {
      setLoading(false);
    }
  }, [productSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <ErrorCard
        title="Product not found"
        description="The Product you are trying to view does not exist."
        linkText="Go back to the products page"
        redirectionLink="/products"
      />
    );
  }

  return <ProductSection product={product} category={category} />;
};

export default ProductPage;
