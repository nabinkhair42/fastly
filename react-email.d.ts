import type { ComponentProps, ReactNode } from "react";

declare module "@react-email/components" {
  export const Html: React.FC<ComponentProps<"html">>;
  export const Head: React.FC<ComponentProps<"head">>;
  export const Body: React.FC<ComponentProps<"body">>;
  export const Container: React.FC<ComponentProps<"div">>;
  export const Text: React.FC<ComponentProps<"p">>;
  export const Img: React.FC<ComponentProps<"img">>;
  export const Section: React.FC<ComponentProps<"div">>;
  export const Row: React.FC<ComponentProps<"tr">>;
  export const Column: React.FC<ComponentProps<"td">>;
  export const Link: React.FC<ComponentProps<"a">>;
  export const Button: React.FC<ComponentProps<"a">>;
  export const Hr: React.FC<ComponentProps<"hr">>;
  export const Heading: React.FC<ComponentProps<"h1">>;
  export const Preview: React.FC<{ children: ReactNode }>;
}
