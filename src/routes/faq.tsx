import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة - كباش" },
      { name: "description", content: "إجابات على أكثر الأسئلة شيوعًا حول مطعم كباش." },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "ما هي مناطق التوصيل المتاحة؟",
    a: "نوصل لجميع المناطق الرئيسية في القاهرة الكبرى. يمكنك التحقق من توفر التوصيل عند إدخال عنوانك.",
  },
  { q: "كم تستغرق مدة التوصيل؟", a: "في المتوسط من 45 إلى 60 دقيقة حسب موقعك ودرجة الازدحام." },
  {
    q: "هل يمكنني الطلب لمناسبة كبيرة؟",
    a: "نعم، نقدم خدمة الطلبات الجماعية للمناسبات والشركات. تواصل معنا لتفاصيل أكثر.",
  },
  { q: "هل تستخدمون مكونات حلال؟", a: "نعم، جميع لحومنا حلال 100٪ ومن موردين معتمدين." },
  {
    q: "ما هي وسائل الدفع المتاحة؟",
    a: "نقبل الدفع نقدًا عند التوصيل، بالبطاقات، والمحافظ الإلكترونية.",
  },
  {
    q: "هل يمكنني إلغاء طلبي؟",
    a: "يمكن إلغاء الطلب خلال أول 5 دقائق من تأكيده. بعد ذلك يتم تجهيزه ولا يمكن إلغاؤه.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell
      eyebrow="مساعدة"
      title="الأسئلة الشائعة"
      description="كل ما تحتاج معرفته عن خدمات كباش."
    >
      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="rounded-xl border border-border bg-surface-2/50 overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-5 text-right"
              >
                <span className="font-bold text-base">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-primary shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
