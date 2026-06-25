import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState, useEffect } from "react";
import { User, MapPin, Phone, Edit3 } from "lucide-react";
import heroMandi from "@/assets/hero-mandi.webp";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "حسابي - كباش" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    mainAddress: "",
    secondaryAddress: "",
    primaryPhone: "",
    secondaryPhone: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("customerProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.fullName) {
          setHasProfile(true);
        } else {
          setIsEditing(true);
        }
      } catch (e) {
        setIsEditing(true);
      }
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("customerProfile", JSON.stringify(formData));
    setIsSaved(true);
    setHasProfile(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsEditing(false);
    }, 1000);
  };

  if (hasProfile && !isEditing) {
    // Social Media Profile View
    return (
      <PageShell eyebrow="حسابي" title="الصفحة الشخصية">
        <div className="max-w-3xl mx-auto">
          {/* Cover and Avatar */}
          <div className="relative rounded-3xl overflow-hidden bg-surface-2/40 border border-border pb-8">
            <div className="h-48 w-full relative overflow-hidden">
              <img src={heroMandi} alt="Cover" className="h-full w-full object-cover blur-sm scale-105" />
              <div className="absolute inset-0 bg-background/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            <div className="px-6 sm:px-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 relative z-10">
              <div className="h-32 w-32 rounded-full border-4 border-background bg-surface flex items-center justify-center shrink-0 shadow-xl overflow-hidden">
                <User className="h-16 w-16 text-muted-foreground opacity-50" />
              </div>
              
              <div className="flex-1 text-center sm:text-right pb-2">
                <h1 className="text-3xl font-black">{formData.fullName}</h1>
              </div>
              
              <div className="pb-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-xl bg-surface-2 hover:bg-surface border border-border px-5 py-2.5 text-sm font-bold transition-colors shadow-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  تعديل الحساب
                </button>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="px-6 sm:px-10 mt-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b border-border pb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    أرقام التواصل
                  </h3>
                  <div className="bg-surface rounded-xl p-4 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">الرقم الأساسي</p>
                    <p className="font-bold text-lg" dir="ltr">{formData.primaryPhone}</p>
                  </div>
                  {formData.secondaryPhone && (
                    <div className="bg-surface rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">الرقم الاحتياطي</p>
                      <p className="font-bold text-lg" dir="ltr">{formData.secondaryPhone}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b border-border pb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    عناوين التوصيل
                  </h3>
                  <div className="bg-surface rounded-xl p-4 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">العنوان الرئيسي</p>
                    <p className="font-bold leading-relaxed">{formData.mainAddress}</p>
                  </div>
                  {formData.secondaryAddress && (
                    <div className="bg-surface rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">العنوان الثانوي</p>
                      <p className="font-bold leading-relaxed">{formData.secondaryAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Edit / Form View
  return (
    <PageShell eyebrow="حسابي" title={hasProfile ? "تعديل البيانات" : "إنشاء حساب"}>
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-border bg-surface-2/40 p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">
              {hasProfile ? "تحديث بياناتك" : "أهلاً بك في كباش"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              يرجى إكمال بيانات التوصيل الخاصة بك للمتابعة.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field
              label="الاسم الكامل *"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Field
              label="رقم الهاتف الأساسي *"
              id="primaryPhone"
              required
              type="tel"
              pattern="^01[0125][0-9]{8}$"
              title="رقم الهاتف يجب أن يكون رقم مصري صحيح يتكون من 11 رقم ويبدأ بـ 01"
              value={formData.primaryPhone}
              onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
            />
            <Field
              label="رقم الهاتف الاحتياطي (اختياري)"
              id="secondaryPhone"
              type="tel"
              pattern="^01[0125][0-9]{8}$"
              title="رقم الهاتف يجب أن يكون رقم مصري صحيح يتكون من 11 رقم ويبدأ بـ 01"
              value={formData.secondaryPhone}
              onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
            />
          </div>

          <div className="space-y-6">
            <Field
              label="العنوان الرئيسي *"
              id="mainAddress"
              required
              value={formData.mainAddress}
              onChange={(e) => setFormData({ ...formData, mainAddress: e.target.value })}
            />
            <Field
              label="العنوان الثانوي (اختياري)"
              id="secondaryAddress"
              value={formData.secondaryAddress}
              onChange={(e) => setFormData({ ...formData, secondaryAddress: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-border/50">
            {hasProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl bg-surface-2 border border-border py-3.5 text-sm font-bold text-foreground hover:bg-surface transition-colors"
              >
                إلغاء
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              {isSaved ? "تم الحفظ بنجاح ✓" : "حفظ البيانات"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  id,
  required,
  type = "text",
  pattern,
  title,
  value,
  onChange,
}: {
  label: string;
  id: string;
  required?: boolean;
  type?: string;
  pattern?: string;
  title?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        pattern={pattern}
        title={title}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl bg-background border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}
