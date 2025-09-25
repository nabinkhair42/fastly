import Image from 'next/image';
import {
  SiMongodb,
  SiNextdotjs,
  SiReactquery,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';
export default function IntegrationsSection() {
  return (
    <section>
      <div className="bg-muted dark:bg-background py-24">
        <div className="mx-auto flex flex-col md:grid max-w-5xl px-4 lg:px-0 md:grid-cols-2 md:gap-12">
          <div className="order-last mt-6 flex flex-col gap-12 md:order-first">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                Built on top of your favorite Tech Stack
              </h2>
              <p className="text-muted-foreground">
                Designed using modern and most popular tech stacks among
                developers.
              </p>
            </div>
            <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
              <div className="bg-background flex aspect-square items-center justify-center border">
                <Image
                  src="/devnk.png"
                  alt="Nabin Khair"
                  className="h-12 w-12"
                  width={100}
                  height={100}
                />
              </div>
              <blockquote>
                <p>Enjoyed while designing and developing this starter kit.</p>
                <div className="mt-2 flex gap-2 text-sm">
                  <cite>Nabin Khair</cite>
                  <p className="text-muted-foreground">Full Stack Developer</p>
                </div>
              </blockquote>
            </div>
          </div>

          <div className="-mx-6 px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
            <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-12 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]">
              <div className="grid grid-cols-2 gap-2">
                <Integration
                  icon={<SiNextdotjs />}
                  name="Next.js"
                  description="Build using the latest app directory and server components."
                />
                <Integration
                  icon={<SiMongodb />}
                  name="Mongodb"
                  description="Use MongoDB for your database needs."
                />
                <Integration
                  icon={<SiReactquery />}
                  name="React Query"
                  description="Fetch, cache, and update data in your React applications."
                />
                <Integration
                  icon={<SiShadcnui />}
                  name="shadcn/ui"
                  description="Build on top of Frontend Developer favorite components library."
                />
                <Integration
                  icon={<SiTailwindcss />}
                  name="Tailwind CSS"
                  description="Rapidly build modern websites without ever leaving your HTML."
                />
                <Integration
                  icon={<SiTypescript />}
                  name="TypeScript"
                  description="Type safety at every step of your development workflow."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Integration = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) => {
  return (
    <div className="bg-card space-y-4 rounded-lg border p-4 transition-colors ">
      <div className="flex size-fit items-center justify-center">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
