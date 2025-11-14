"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, BookHeart } from "lucide-react";
import Link from "next/link";
import { GiCube } from "react-icons/gi";

export default function LandingPage() {
  return (
    <div className="max-w-2xl flex flex-col justify-center items-center h-screen mx-auto px-6 xl:px-0">
      <div className="text-center space-y-6">
        {/* Logo/Brand */}
        <div className=" flex items-center gap-3">
          <GiCube size={34} />
          <h1 className="text-4xl font-bold">Fastly</h1>
        </div>

        {/* Main Message */}
        <div className="text-left space-y-3">
          <h2 className="text-2xl font-semibold">
            Get started by cloning the repository
          </h2>
          <p className="text-muted-foreground">
            A fully-featured SaaS starter kit built with Next.js, TypeScript,
            MongoDb and Tailwind CSS.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-4">
          <Button size="lg" asChild={true} className="rounded-full">
            <Link
              href="/create-account"
              className="inline-flex items-center gap-2"
            >
              Create Account
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild={true}
            className="rounded-full"
          >
            <Link
              href="https://fastly.nabinkhair.com.np/docs"
              target="_blank"
              className="inline-flex items-center gap-2"
            >
              <BookHeart className="h-4 w-4" />
              Read Docs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
