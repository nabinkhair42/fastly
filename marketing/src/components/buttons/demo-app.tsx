"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const DemoButton = () => {
  const router = useRouter();
  const handleDemoClick = () => {
    router.push("https://create-fastly-app.nabinkhair.com.np");
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDemoClick}
      className="rounded-full sm:inline-flex"
    >
      Demo App
      <ArrowUpRight />
    </Button>
  );
};
