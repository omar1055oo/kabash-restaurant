import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام - كباش" },
      { name: "description", content: "الشروط والأحكام الخاصة باستخدام موقع وخدمات كباش." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "1. القبول بالشروط",
    p: "باستخدامك لموقع كباش وخدماته، فإنك توافق على الالتزام بهذه الشروط والأحكام.",
  },
  {
    h: "2. الطلبات والدفع",
    p: "تخضع جميع الطلبات لتوافر المنتجات. الأسعار قابلة للتغيير دون إشعار مسبق.",
  },
  {
    h: "3. التوصيل",
    p: "نسعى لتوصيل الطلبات في الوقت المحدد، ولا نتحمل مسؤولية التأخير الناتج عن ظروف خارجة عن إرادتنا.",
  },
  {
    h: "4. الإلغاء والاسترداد",
    p: "يمكن إلغاء الطلب خلال 5 دقائق من تأكيده. بعد ذلك لا يحق طلب الاسترداد إلا في حالات الخلل.",
  },
  {
    h: "5. الملكية الفكرية",
    p: "جميع المحتويات على الموقع من شعارات وصور هي ملكية حصرية لكباش ولا يجوز استخدامها بدون إذن.",
  },
  {
    h: "6. تعديل الشروط",
    p: "نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة.",
  },
];

function TermsPage() {
  return (
    <PageShell eyebrow="قانوني" title="الشروط والأحكام" description="آخر تحديث: يونيو 2026">
      <div className="max-w-3xl mx-auto space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-bold mb-3">{s.h}</h2>
            <p className="text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
