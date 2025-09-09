import { FieldValue } from "firebase/firestore";
import { ReactNode } from "react";

export type TPaymentMethod = "E-WALLET" | "CASH" | "BANK_TRANSFER";
export type TPaymentDetails = {
  id: string;
  accountName: string;
  accountNumber: string;
  paymentMethod: TPaymentMethod;
  paymentProvider: string;
  qrImageURL?: string | null;
};
export type TRaceGender = "male" | "female";
export type TGoogleUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};
export type TUser = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  currentEventID?: string | null;
  clubID?: string;
};

export type TImageReceipt = {
  id: string;
  url: string;
  userID: string | null;
  emailAddress: string;
};

export type TMediaFile = {
  id: string;
  url: string;
  name: string;
  type: string;
  order?: number;
  isFeatured?: boolean;
};
export type TFilePreview = File & { preview: string };
export type TPeriod = "AM" | "PM";

export type TTime = {
  hour: string;
  minute: string;
  period: TPeriod;
};

export type TAdminLink = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
};

export type TStore = {
  id: string;
  slug: string;
  name: string;
  location: string;
  coordinates: string;
  description: string;
  thumbnailImage: string | null;
  images: TMediaFile[];
  createdAt: string;
  timestamp: FieldValue | string;
  isActive?: boolean;
  openingTime: string;
  closingTime: string;
};

export type TProduct = {
  id: string;
  name: string;
  slug: string;
  categoryID?: string | null;
  description: string;
  thumbnailImage?: string | null;
  images: TMediaFile[];
  price: number;
  tags: string;
  isPublished?: boolean;
  createdAt: string;
  timestamp: FieldValue | string;
  variants: TProductVariant[]; // 👈 variants instead of single price/size
};

export type TProductVariant = {
  id: string;
  name: string; // e.g. "Regular", "Junior"
  price: number; // e.g. 1350 or 950
  size?: string; // optional (Small, Medium, Large)
  thumbnailImage?: string | null;
  imageURLs?: string[];
};

export type TInventory = {
  id: string; // unique inventory record
  productID: string; // reference to TStore
  branchID: string; // reference to TProduct
  variantID: string; // reference to TProductVariant
  stock: number; // how many available
  updatedAt: string; // ISO date
  createdAt: string;
  timestamp: FieldValue | string;
};

export type TInventoryTableItem = TInventory & {
  productName: string;
  branchName: string;
  variantName: string;
  categoryName: string;
  price: number;
};

export type TProductCategory = {
  id: string;
  name: string;
  description: string;
  tags: string;
};

export type TSettings = {
  deliveryFee: number;
  paymentOptions: TPaymentOptionDetails[];
  updatedAt: string;
  images?: TMediaFile[] | null;
};
export type TPaymentOptionDetails = {
  id: string;
  accountName: string;
  accountNumber: string;
  providerName: string;
};

export type TOrderStatus =
  | "PENDING" // customer placed order, not yet confirmed
  | "CONFIRMED" // accepted, waiting for preparation
  | "PREPARING" // being prepared
  | "READY_FOR_PICKUP" // in-store pickup ready
  | "OUT_FOR_DELIVERY" // on the way
  | "COMPLETED" // picked up / delivered successfully
  | "CANCELLED"; // cancelled by store or customer

export type TOrderItem = {
  id: string; // unique item id in this order
  productID: string; // reference to TProduct
  variantID?: string | null; // reference to TProductVariant if applicable
  productName: string;
  variantName?: string | null;
  quantity: number;
  price: number; // unit price
  subtotal: number; // price * quantity
  branchID?: string | null;
};

export type TOrder = {
  id: string;
  userID: string; // reference to TUser (customer)
  branchID: string; // reference to TStore
  items: TOrderItem[]; // list of products in the order
  totalAmount: number; // sum of all subtotals
  paymentMethod: TPaymentMethod; // "CASH", "E-WALLET", "BANK_TRANSFER"
  paymentDetailsID?: string | null; // reference to TPaymentDetails if used
  receiptImage?: TImageReceipt | null; // uploaded proof of payment
  status: TOrderStatus;
  notes?: string; // customer notes (e.g. "Happy Birthday on cake")
  createdAt: string; // ISO date
  updatedAt: string;
  orderType: "PICKUP" | "DELIVERY"; // 👈 new field
  timestamp: FieldValue | string; // Firestore serverTimestamp
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
};

export type TCartItem = {
  id: string; // unique cart line id
  productID: string; // reference to TProduct
  variantID?: string | null; // reference to TProductVariant (if applicable)
  branchID?: string | null; // reference to TStore branch (optional if multi-branch)
  name: string; // snapshot of product name
  variantName?: string; // snapshot of variant name
  price: number; // snapshot of price at time added
  quantity: number; // number of items
  imageURL?: string | null; // snapshot of product image
  stockAvailable?: number; // optional check against inventory
  notes?: string; // e.g. "Happy Birthday on top" for cakes
};

export type TCart = {
  id: string; // cart/session id
  userID?: string | null; // logged in user (optional for guest cart)
  items: TCartItem[];
  subtotal: number; // sum of item price * qty
  discounts?: number; // total discounts applied
  deliveryFee?: number; // optional
  total: number; // final total (subtotal - discounts + deliveryFee)
  createdAt: string;
  updatedAt: string;
};
