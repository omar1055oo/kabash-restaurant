import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({ meta: [{ title: "تم تأكيد الطلب - كباش" }] }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  return (
    <PageShell>
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="h-16 w-16 rounded-full bg-primary/15 text-primary inline-flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">شكرًا لطلبك!</h1>
        <p className="text-muted-foreground mb-6">
          تم استلام طلبك بنجاح. سيتواصل معك مندوب بخصوص الطلب للتأكيد.
        </p>
        <div className="rounded-xl border border-border bg-surface-2/60 p-5 text-sm text-right inline-block w-full">
          <Row label="الإجمالي" value="505 ج" />
          <Row label="وقت التوصيل المتوقع" value="45 - 60 دقيقة" />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
