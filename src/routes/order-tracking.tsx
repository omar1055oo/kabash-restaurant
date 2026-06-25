import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Check, ChefHat, Bike, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/order-tracking")({
  head: () => ({ meta: [{ title: "تتبع الطلب - كباش" }] }),
  component: OrderTrackingPage,
});

const STEPS = [
  { icon: Check, label: "تم تأكيد الطلب", time: "8:14 م", done: true },
  { icon: ChefHat, label: "قيد التحضير", time: "8:18 م", done: true },
  { icon: Bike, label: "في الطريق إليك", time: "8:42 م", done: true, current: true },
  { icon: PackageCheck, label: "تم التوصيل", time: "متوقع 8:55 م", done: false },
];

function OrderTrackingPage() {
  return (
    <PageShell eyebrow="تتبع الطلب" title="طلبك في الطريق" description="رقم الطلب #10250">
      <div className="max-w-2xl mx-auto">
        <ol className="relative space-y-6 pr-6 border-r-2 border-border">
          {STEPS.map((s) => (
            <li key={s.label} className="relative">
              <span
                className={`absolute -right-[34px] top-0 h-10 w-10 rounded-full inline-flex items-center justify-center border-2 ${
                  s.done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <div
                className={`rounded-xl border p-4 ${s.current ? "border-primary bg-primary/5" : "border-border bg-surface-2/40"}`}
              >
                <div className="font-bold">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.time}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-border bg-surface-2/60 p-5 text-sm">
          <h2 className="font-bold mb-3">مندوب التوصيل</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">محمود علي</div>
              <div className="text-xs text-muted-foreground">دراجة • لوحة 1234</div>
            </div>
            <a
              href="tel:01000000000"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              اتصال
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
