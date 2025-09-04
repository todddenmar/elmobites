export const E_WALLETS = ["GCash", "Maya"];
export const PHILIPPINES_BANKS = [
  "Asia United Bank (AUB)",
  "Bank of Commerce",
  "Bank of the Philippine Islands (BPI)",
  "BDO Unibank",
  "China Banking Corporation (Chinabank)",
  "Citibank Philippines",
  "Development Bank of the Philippines (DBP)",
  "EastWest Bank",
  "HSBC Philippines",
  "Land Bank of the Philippines (Landbank)",
  "Maybank Philippines",
  "Metropolitan Bank & Trust Company (Metrobank)",
  "Overseas Filipino Bank (OFBank)",
  "Philippine Bank of Communications (PBCom)",
  "Philippine National Bank (PNB)",
  "Philippine Savings Bank (PSBank)",
  "Rizal Commercial Banking Corporation (RCBC)",
  "Robinsons Bank",
  "SeaBank Philippines",
  "Security Bank",
  "Sterling Bank of Asia",
  "Tonik Digital Bank",
  "UCPB Savings Bank",
  "UNO Digital Bank",
  "Union Bank of the Philippines (UnionBank)",
];
export const PAYMENT_OPTION = {
  E_WALLET: { id: "E_WALLET", label: "E-Wallet" },
  CASH: { id: "CASH", label: "Cash" },
  BANK_TRANSFER: { id: "BANK_TRANSFER", label: "Bank Transfer" },
};

export const PAYMENT_OPTIONS = [
  PAYMENT_OPTION.E_WALLET,
  PAYMENT_OPTION.BANK_TRANSFER,
  PAYMENT_OPTION.CASH,
];

export const DB_METHOD_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
};

export const DB_COLLECTION = {
  USERS: "users",
  RECEIPTS: "receipts",
};

export const OPTIONS_HOUR = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 1; // Generates numbers from 1 to 12
  return {
    value: hour.toString(),
    label: `${hour}`,
  };
});

export const OPTIONS_MINUTE = Array.from({ length: 12 }, (_, index) => {
  const minute = index * 5; // Generates 0, 5, 10, ..., 55
  return {
    value: minute.toString().padStart(2, "0"), // Ensures two-digit format
    label: minute.toString().padStart(2, "0"),
  };
});