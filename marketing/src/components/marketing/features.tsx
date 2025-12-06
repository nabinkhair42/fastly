import type { ReactNode } from "react";
import {
  FaCloudUploadAlt,
  FaCodeBranch,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { SiJsonwebtokens, SiTypescript } from "react-icons/si";

type Feature = {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const features: Feature[] = [
  {
    title: "Secure Authentication",
    description:
      "Email, Google, and GitHub login with verification, password reset, and OAuth support.",
    Icon: FaUserShield,
  },
  {
    title: "Customizable Profiles",
    description:
      "Avatars, themes, fonts, and social links with rules for one-time username changes.",
    Icon: FaUserCircle,
  },
  {
    title: "Seamless Uploads",
    description:
      "Client-side image cropping with server cleanup for hassle-free avatar uploads.",
    Icon: FaCloudUploadAlt,
  },
  {
    title: "Robust APIs",
    description:
      "Zod-validated endpoints and consistent response helpers built for production.",
    Icon: FaCodeBranch,
  },
  {
    title: "Type-Safe Data",
    description: "MongoDB with Mongoose models, fully typed with TypeScript.",
    Icon: SiTypescript,
  },
  {
    title: "JWT Security",
    description:
      "Access and refresh tokens with automatic rotation and protected routes.",
    Icon: SiJsonwebtokens,
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-4 lg:px-0 space-y-8 md:space-y-16">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Existing Features
          </h2>
          <p className="mt-4">
            All of the essential features you need to build your SaaS product
            faster.
          </p>
        </div>
        <div className="relative mx-auto grid divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div className="space-y-3 " key={index}>
              <div className="flex flex-col gap-2">
                <CardDecorator>
                  <feature.Icon className="size-6" aria-hidden={true} />
                </CardDecorator>

                <h3 className="font-medium text-center">{feature.title}</h3>
              </div>

              <div>
                <p className="text-sm text-center text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden={true}
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
