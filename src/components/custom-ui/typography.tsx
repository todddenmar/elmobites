import { ReactNode } from "react";

type TTypographyProps = {
  children: ReactNode;
};

export function TypographyH1({ children }: TTypographyProps) {
  return (
    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-6xl">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: TTypographyProps) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: TTypographyProps) {
  return (
    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}
export function TypographyH4({ children }: TTypographyProps) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function TypographyP({ children }: TTypographyProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
