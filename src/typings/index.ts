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