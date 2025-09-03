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
