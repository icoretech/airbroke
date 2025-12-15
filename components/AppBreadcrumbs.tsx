import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Route } from "next";

type Crumb = {
  label: React.ReactNode;
  href?: string | null;
};

export default function AppBreadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null;
  const lastIndex = items.length - 1;
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap overflow-hidden w-full">
        {items.map((item, idx) => (
          <Fragment key={`frag-${idx}`}>
            <BreadcrumbItem key={`crumb-${idx}`}>
              {idx === lastIndex || !item.href ? (
                <BreadcrumbPage
                  className={labelClass(idx)}
                  title={String(item.label)}
                >
                  <span className="block truncate">{item.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  {/* Next Link is type-restricted to internal routes; fall back to <a> for external */}
                  {item.href?.startsWith("/") ? (
                    <Link
                      href={item.href as Route}
                      className={labelClass(idx)}
                      title={String(item.label)}
                    >
                      <span className="block truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      rel="noreferrer"
                      className={labelClass(idx)}
                      title={String(item.label)}
                    >
                      <span className="block truncate">{item.label}</span>
                    </a>
                  )}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < lastIndex && <BreadcrumbSeparator key={`sep-${idx}`} />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function labelClass(index: number) {
  // Conservative truncation per position; hide org on small screens to save space.
  // 0: "Projects" (short)
  if (index === 1) return "hidden md:inline-block max-w-40 lg:max-w-56";
  if (index === 2)
    return "inline-block max-w-48 sm:max-w-[16rem] lg:max-w-[24rem]";
  if (index >= 3) return "inline-block max-w-48 sm:max-w-[20rem] lg:max-w-xl";
  return "inline-block max-w-32 sm:max-w-40";
}
