import Image from 'next/image';

const TechStack = () => {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-medium">
          Built on top of your favorite Tech Stack.
        </h2>
        <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
          <Image
            className="h-4 w-fit dark:invert dark:hidden"
            src="/tech/nextjs-light.svg"
            alt="Next.js Logo"
            height="16"
            width="16"
          />
          <Image
            className="h-4 w-fit hidden dark:block"
            src="/tech/nextjs-dark.svg"
            alt="Next.js Logo"
            height="16"
            width="16"
          />
          <Image
            className="h-4 w-fit dark:invert"
            src="/tech/tailwindcss.svg"
            alt="Tailwind CSS Logo"
            height="16"
            width="16"
          />
          <Image
            className="h-5 w-fit dark:invert dark:hidden"
            src="/tech/mongodb-light.svg"
            alt="MongoDB Logo"
            height="16"
            width="16"
          />
          <Image
            className="h-5 w-fit hidden dark:block"
            src="/tech/mongodb-dark.svg"
            alt="MongoDB Logo"
            height="16"
            width="16"
          />
          <Image
            className="h-5 w-fit dark:invert"
            src="/tech/vercel.svg"
            alt="Vercel Logo"
            height="20"
            width="16"
          />

          <Image
            className="h-4 w-fit dark:invert"
            src="/tech/github.svg"
            alt="GitHub Logo"
            height="16"
            width="16"
          />
        </div>
      </div>
    </section>
  );
};

export default TechStack;
