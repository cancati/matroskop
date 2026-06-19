import { Shield, BarChart2, Users, ArrowLeft } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sol panel — sadece desktop */}
      <div className="hidden md:flex w-1/2 bg-brand flex-col justify-between p-12 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-xl">Matroskop</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow inline-block" />
        </div>

        {/* Orta alıntı */}
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug">
            Her Çocuk Aynı<br />Yerden Başlamaz.
          </h2>
          <p className="text-white/60 text-lg mt-4">
            Bilimsel ölçme ile her öğrenciye özel yol.
          </p>
        </div>

        {/* Alt özellikler */}
        <div className="flex gap-6">
          {[
            { icon: Shield,   label: "Güvenli Altyapı" },
            { icon: BarChart2, label: "PISA–TIMSS Standartları" },
            { icon: Users,    label: "6 Kullanıcı Rolü" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-white/60 flex-shrink-0" />
              <span className="text-white/70 text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Dekoratif daireler */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-32 h-32 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className="w-full md:w-1/2 bg-surface min-h-screen flex items-center justify-center p-8 relative">
        <a
          href="/anasayfa"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </a>
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
