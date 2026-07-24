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
  const seenKeys = new Map<string, number>();
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap overflow-hidden w-full">
        {items.map((item, idx) => {
          const baseKey = item.href ?? String(item.label);
          const seenCount = seenKeys.get(baseKey) ?? 0;
          seenKeys.set(baseKey, seenCount + 1);
          const itemKey =
            seenCount === 0 ? baseKey : `${baseKey}-${seenCount + 1}`;
          const isTabletOptional = idx === 1 || (idx === 3 && idx < lastIndex);
          const isMobileOptional = idx === 2 && idx < lastIndex;
          const itemClass = isTabletOptional
            ? "hidden lg:inline-flex"
            : isMobileOptional
              ? "hidden sm:inline-flex"
              : idx === lastIndex
                ? "min-w-0 flex-1"
                : undefined;

          return (
            <Fragment key={itemKey}>
              <BreadcrumbItem className={itemClass}>
                {idx === lastIndex || !item.href ? (
                  <BreadcrumbPage
                    className={labelClass(idx)}
                    title={String(item.label)}
                  >
                    <span className="block truncate">{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      item.href?.startsWith("/") ? (
                        <Link
                          href={item.href as Route}
                          className={labelClass(idx)}
                          title={String(item.label)}
                        />
                      ) : (
                        (props) => (
                          <a
                            {...props}
                            href={item.href ?? undefined}
                            rel="noreferrer"
                          >
                            {props.children}
                          </a>
                        )
                      )
                    }
                  >
                    <span className="block truncate">{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < lastIndex && (
                <BreadcrumbSeparator
                  className={
                    isTabletOptional
                      ? "hidden lg:list-item"
                      : isMobileOptional
                        ? "hidden sm:list-item"
                        : undefined
                  }
                />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function labelClass(index: number) {
  // Conservative truncation per position; the organization item is hidden by
  // the caller on small screens to save space.
  // 0: "Projects" (short)
  if (index === 1) return "inline-block max-w-40 lg:max-w-56";
  if (index === 2)
    return "inline-block max-w-48 sm:max-w-[16rem] lg:max-w-[24rem]";
  if (index >= 3) return "inline-block max-w-48 sm:max-w-[20rem] lg:max-w-xl";
  return "inline-block max-w-32 sm:max-w-40";
}
