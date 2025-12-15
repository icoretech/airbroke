// app/not-found.tsx

import Image from "next/image";
import Link from "next/link";
import { TbFileXFilled } from "react-icons/tb";
import PageBackground from "@/components/PageBackground";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg";

export default function NotFound() {
  return (
    <main className="relative min-h-screen">
      <PageBackground>
        <div className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-24 sm:py-32">
          <div className="mx-auto w-full max-w-xl text-center text-white">
            {/* Brand */}
            <div className="mb-6 flex items-center justify-center">
              <Image
                src={logo}
                alt="Airbroke"
                width={463}
                height={338}
                className="h-9 w-auto md:h-10"
              />
            </div>

            {/* Card */}
            <div className="rounded-xl border border-white/10 bg-card/70 p-6 shadow-sm ring-1 ring-white/5 backdrop-blur">
              <div className="flex flex-col items-center">
                <TbFileXFilled
                  className="mb-3 h-10 w-10 text-gray-400"
                  aria-hidden="true"
                />
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Page not found
                </h1>
                <p className="mt-2 max-w-prose text-sm text-gray-300">
                  The page you’re looking for doesn’t exist or may have moved.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild>
                    <Link href="/projects">Back to Projects</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Go Home</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Tip */}
            <p className="mt-6 text-xs text-gray-400">
              Tip: Check the URL or return to Projects to continue.
            </p>
          </div>
        </div>
      </PageBackground>
    </main>
  );
}
