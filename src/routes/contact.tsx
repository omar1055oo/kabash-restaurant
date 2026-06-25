import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا - كباش" },
      { name: "description", content: "تواصل مع فريق كباش للاستفسارات والطلبات الجماعية." },
    ],
  }),
  component: ContactPage,
});

const INFO = [
  { icon: Phone, label: "اتصل بنا", value: "19000" },
  { icon: Mail, label: "البريد الإلكتروني", value: "hello@kabash.eg" },
  { icon: MapPin, label: "العنوان", value: "المنيا , بني مزار" },
  { icon: Clock, label: "ساعات العمل", value: "يوميًا من 12 ظهرًا حتى 1 صباحًا" },
];

function ContactPage() {
  return (
    <PageShell
      eyebrow="تواصل معنا"
      title="نحن سعداء بسماع رأيك"
      description="استفساراتك واقتراحاتك تهمنا. تواصل معنا وسنرد عليك في أقرب وقت."
    >
      <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
        {INFO.map((i) => (
          <div
            key={i.label}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface-2/60 p-5"
          >
            <div className="h-10 w-10 rounded-md bg-primary/15 text-primary inline-flex items-center justify-center shrink-0">
              <i.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{i.label}</div>
              <div className="font-bold">{i.value}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
