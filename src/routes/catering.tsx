import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Users, CalendarDays, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "الطلبات الجماعية - كباش" },
      { name: "description", content: "اطلب لمناسبتك وعزائمك من كباش." },
    ],
  }),
  component: CateringPage,
});

function CateringPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    guests: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.date || !formData.guests) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    toast.success("تم إرسال طلبك بنجاح! سيتواصل معك المطعم لتأكيد الطلب.");

    const text = `
*طلب جديد - طلبات جماعية* 🍽️
----------------------
*الاسم:* ${formData.name}
*رقم الهاتف:* ${formData.phone}
*تاريخ المناسبة:* ${formData.date}
*عدد الأشخاص:* ${formData.guests}
${formData.details ? `*التفاصيل:* ${formData.details}` : ""}
    `.trim();

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/201000000000?text=${encodedText}`;
    
    setFormData({
      name: "",
      phone: "",
      date: "",
      guests: "",
      details: "",
    });

    window.open(whatsappUrl, "_blank");
  };

  return (
    <PageShell
      eyebrow="الطلبات الجماعية"
      title="شاركنا مناسباتك"
      description="نقدم أفضل العروض والوجبات للمناسبات والعزائم والشركات بأعلى جودة وأفضل طعم."
    >
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">للعزائم والمناسبات العائلية</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                وفرنا لك تشكيلة رائعة من الصواني التي تكفي العائلة والضيوف، محضرة بعناية لتناسب
                ذوقكم وتبيض وجهك في عزوماتك.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">للشركات والمؤسسات</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                عروض خاصة للشركات واجتماعات العمل، وجبات فردية أو صواني مشاركة بأسعار تنافسية وخدمة
                توصيل في الوقت المحدد.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">الحجز المسبق</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                يرجى التواصل معنا قبل موعد المناسبة بـ 24 ساعة على الأقل لضمان تقديم الخدمة بأفضل
                صورة.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/60 p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6">اطلب لمناسبتك الآن</h2>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم الكريم
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="اكتب اسمك هنا"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors text-right"
                  placeholder="0100 000 0000"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-medium">
                  تاريخ المناسبة
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="guests" className="text-sm font-medium">
                  عدد الأشخاص المتوقع
                </label>
                <input
                  id="guests"
                  type="number"
                  min="5"
                  value={formData.guests}
                  onChange={handleChange}
                  className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="text-sm font-medium">
                تفاصيل الطلب (اختياري)
              </label>
              <textarea
                id="details"
                rows={4}
                value={formData.details}
                onChange={handleChange}
                className="resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary transition-colors"
                placeholder="اكتب ما تحتاجه أو أي تفاصيل إضافية..."
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              إرسال الطلب
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
