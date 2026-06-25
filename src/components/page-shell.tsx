import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PageShell({
  children,
  title,
  eyebrow,
  description,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  description?: string;
}) {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {title && (
          <section className="border-b border-border bg-surface-2/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
              {eyebrow && (
                <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  {eyebrow}
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                {title}
              </h1>
              {description && (
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </section>
        )}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
