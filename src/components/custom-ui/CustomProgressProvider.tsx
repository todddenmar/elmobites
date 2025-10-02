"use client";

import { ProgressProvider } from "@bprogress/next/app";

const CustomProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ProgressProvider
      height="4px"
      color="#ef4444"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default CustomProgressProvider;
