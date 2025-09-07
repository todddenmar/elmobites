import ErrorCard from "@/components/custom-ui/ErrorCard";
import ProductSection from "@/components/products/ProductSection";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import {
  dbFetchCollection,
  dbFetchCollectionWhere,
} from "@/lib/firebase/actions";
import { TProduct, TProductCategory } from "@/typings";
import { Metadata } from "next";

type Params = Promise<{ slug: string }>;

const getProductDataBySlug = async (productSlug: string) => {
  let product = null;
  let category = null;
  const res = await dbFetchCollectionWhere({
    collectionName: DB_COLLECTION.PRODUCTS,
    fieldName: "slug",
    fieldValue: productSlug,
    operation: "==",
  });
  if (res.status === DB_METHOD_STATUS.SUCCESS) {
    if (res.data) product = res.data[0] as TProduct;
  }

  const resCategory = await dbFetchCollection(DB_COLLECTION.PRODUCT_CATEGORIES);
  if (resCategory.status === DB_METHOD_STATUS.SUCCESS) {
    if (resCategory.data) category = resCategory.data[0] as TProductCategory;
  }
  return {
    product: product
      ? { ...product, timestamp: product.timestamp.toString() }
      : null,
    category: category || null,
  };
};

// ✅ Dynamic metadata
export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const { product } = await getProductDataBySlug(params.slug);

  if (!product) {
    return {
      title: "Product not found | The Cake Co.",
      description: "The Product you are trying to view does not exist.",
    };
  }

  return {
    title: `${product.name} | Productracers`,
    description: `Order delicious custom cakes online from The Cake Co. Pagadian City. Freshly baked, beautifully designed, and delivered straight to your doorstep!`,
  };
}

const ProductPage = async (props: { params: Params }) => {
  const params = await props.params;
  if (!params) {
    return <div>Page Error</div>;
  }
  const slug = params.slug;
  const { product, category } = await getProductDataBySlug(slug);
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
  return (
    <div>
      <ProductSection product={product} category={category} />
    </div>
  );
};

export default ProductPage;
