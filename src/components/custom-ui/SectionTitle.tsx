import React, { ReactNode } from "react";
import { TypographyH2 } from "./typography";

type SectionTitleProps = {
  children: ReactNode;
};
function SectionTitle({ children }: SectionTitleProps) {
  return <TypographyH2>{children}</TypographyH2>;
}

export default SectionTitle;
