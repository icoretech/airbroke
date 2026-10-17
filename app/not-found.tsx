// app/not-found.tsx

import Image from "next/image";
import Link from "next/link";
import { TbFileXFilled } from "react-icons/tb";
import PageBackground from "@/components/layout/PageBackground";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/public/logo.svg";

export default function NotFound() {
  return (
    <main className="relative min-h-screen">
      <PageBackground>
        <div className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-24 sm:py-32">
          <div className="mx-auto w-full max-w-xl text-center text-foreground">
            {/* Brand */}
            <div className="mb-6 flex items-center justify-center">
              <Image
                src={logo}
                alt="Airbroke"
                width={463}
                height={338}
                className="h-9 md:h-10"
                style={{ width: "auto" }}
              />
            </div>

            {/* Card */}
            <Card>
              <CardHeader className="justify-items-center">
                <TbFileXFilled
                  className="mb-3 size-10 text-muted-foreground"
                  aria-hidden="true"
                />
                <CardTitle>
                  <h1>Page not found</h1>
                </CardTitle>
                <CardDescription>
                  The page you’re looking for doesn’t exist or may have moved.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/projects" className={buttonVariants()}>
                  Back to Projects
                </Link>
                <Link
                  href="/"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Go Home
                </Link>
              </CardContent>
            </Card>

            {/* Tip */}
            <p className="mt-6 text-xs text-muted-foreground">
              Tip: Check the URL or return to Projects to continue.
            </p>
          </div>
        </div>
      </PageBackground>
    </main>
  );
}
