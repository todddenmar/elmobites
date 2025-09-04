import React, { ReactNode } from "react";

type ContainerLayoutProps = {
  children: ReactNode;
};
function ContainerLayout({ children }: ContainerLayoutProps) {
  return <div className="max-w-6xl mx-auto w-full">{children}</div>;
}

export default ContainerLayout;
