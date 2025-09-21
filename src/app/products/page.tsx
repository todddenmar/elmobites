"use client";
import ProductCard from "@/components/products/ProductCard";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
} from "@/lib/firebase/actions";
import { TInventory, TProduct, TProductCategory } from "@/typings";
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
import { Button } from "@/components/ui/button";
import LoadingCard from "@/components/custom-ui/LoadingCard";

const ProductsPage = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TProductCategory[]>([]);
  const [inventory, setInventory] = useState<TInventory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const getProductsData = async () => {
      let products: TProduct[] = [];
      let categories: TProductCategory[] = [];
      let inventory: TInventory[] = [];

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

      const resInventory = await dbFetchCollection(DB_COLLECTION.INVENTORY);
      if (resInventory.status === DB_METHOD_STATUS.SUCCESS) {
        inventory = resInventory.data as TInventory[];
      }

      setProducts(products || []);
      setCategories(categories || []);
      setInventory(inventory || []);
    };
    getProductsData();
  }, []);

  if (!products || products.length === 0) {
    return (
      <LoadingCard
        title="Loading..."
        description="Our cakes will be available soon."
        linkText="Go back to homepage"
        redirectionLink="/"
      />
    );
  }

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.categoryID === selectedCategory);

  return (
    <div>
      {/* Breadcrumb */}
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

      <div className="w-full p-4 lg:mx-auto lg:max-w-7xl space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={selectedCategory === c.id ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {filteredProducts.map((item) => {
            const category = categories.find((c) => c.id === item.categoryID);
            let stocks = 0;
            inventory.forEach((i) => {
              if (i.productID === item.id && i.stock > 0) {
                stocks += 1;
              }
            });

            return (
              <Link
                key={`product-item-${item.id}`}
                href={`/products/${item.slug}`}
              >
                <ProductCard
                  isOutOfStock={stocks <= 0}
                  product={item}
                  category={category || null}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
