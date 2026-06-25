import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "فروعنا - كباش" },
      { name: "description", content: "تعرف على فروع مطعم كباش وأقرب فرع إليك." },
    ],
  }),
  component: BranchesPage,
});

const BRANCHES = [
  {
    name: "فرع التجمع الخامس",
    address: "شارع التسعين الجنوبي، مجمع المطاعم، التجمع الخامس، القاهرة",
    phone: "0100 000 0001",
    hours: "12:00 ظهراً - 02:00 صباحاً",
  },
  {
    name: "فرع الشيخ زايد",
    address: "أركان بلازا، المحور المركزي، الشيخ زايد، الجيزة",
    phone: "0100 000 0002",
    hours: "12:00 ظهراً - 02:00 صباحاً",
  },
  {
    name: "فرع المعادي",
    address: "شارع 9، المعادي، القاهرة",
    phone: "0100 000 0003",
    hours: "12:00 ظهراً - 01:00 صباحاً",
  },
];

function BranchesPage() {
  return (
    <PageShell
      eyebrow="فروعنا"
      title="أقرب إليك دائماً"
      description="نسعد بزيارتكم في أي من فروعنا لتقديم تجربة طعام استثنائية بنكهات خليجية أصيلة."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANCHES.map((branch, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface-2/40 p-6 flex flex-col gap-4"
          >
            <h3 className="text-xl font-bold text-primary">{branch.name}</h3>

            <div className="flex flex-col gap-3 text-sm mt-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <span dir="ltr" className="text-right">
                  {branch.phone}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                <span>{branch.hours}</span>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-xl bg-surface border border-border px-4 py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5 transition-colors"
              >
                الاتجاهات
              </a>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
