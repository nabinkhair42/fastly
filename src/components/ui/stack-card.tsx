'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useRef } from 'react';

interface FeatureData {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface FeatureCardProps {
  i: number;
  data: FeatureData;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const FeatureCard = ({
  i,
  data,
  progress,
  range,
  targetScale,
}: FeatureCardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="max-h-screen flex items-center justify-center sticky top-70"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 5}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[500px] w-[80%] max-w-5xl border rounded-xl p-8 origin-top shadow-2xl bg-card button-shadow `}
      >
        {/* Header with icon and title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary/20 rounded-lg backdrop-blur-sm">
            <div>{data.icon}</div>
          </div>
          <h2 className="text-3xl font-bold ">{data.title}</h2>
        </div>

        <div className="flex h-full gap-8 items-start pt-6">
          {/* Left side - Description */}
          <div className="w-2/5 flex flex-col  justify-center">
            <p className="text-lg leading-relaxed mb-6">{data.description}</p>
          </div>

          {/* Right side - Features list */}
          <div className="w-3/5 backdrop-blur-sm rounded-lg overflow-hidden">
            <motion.div style={{ scale: imageScale }} className="w-full h-full">
              <Image
                src={data.image}
                alt={data.title}
                className="object-cover aspect-video rounded-lg shadow-lg"
                width={800}
                height={600}
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface FeaturesStackProps {
  features: FeatureData[];
}

const FeaturesStack = ({ features }: FeaturesStackProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <main ref={container} className="relative">
        {/* Features cards */}
        <section className="w-full py-20 flex flex-col gap-20">
          {features.map((feature, i) => {
            const targetScale = 1 - (features.length - i) * 0.05;
            return (
              <FeatureCard
                key={`feature_${feature.id}`}
                i={i}
                data={feature}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
};

export default FeaturesStack;
