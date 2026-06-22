"use client"

import { useState, useEffect } from "react"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth.store"

interface ExamStat   { correct: number; wrong: number; blank: number }
interface ExamResult { id: string; G57: number; G58: number; G59: number; G76: number; level: string }
interface Exam {
  id: string; grade: number; createdAt: string; endedAt: string | null
  result: ExamResult | null
  stats: { G57: ExamStat; G58: ExamStat; G59: ExamStat }
}

type ScoreKey = "G57" | "G58" | "G59"

const LEVELS: Record<string, { bg: string; text: string; border: string; bar: string; ring: string; label: string; idx: number }> = {
  A1: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     bar: "bg-red-600",     ring: "#dc2626", label: "Başlangıç",  idx: 0 },
  A2: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  bar: "bg-orange-500",  ring: "#ea580c", label: "Temel",      idx: 1 },
  B1: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   bar: "bg-amber-500",   ring: "#d97706", label: "Orta",       idx: 2 },
  B2: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", bar: "bg-emerald-500", ring: "#059669", label: "İleri Orta", idx: 3 },
  C1: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    bar: "bg-blue-500",    ring: "#2563eb", label: "İleri",      idx: 4 },
  C2: { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200",  bar: "bg-purple-500",  ring: "#7c3aed", label: "Uzman",      idx: 5 },
}
const LEVEL_KEYS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const CATS: { key: ScoreKey; label: string; weight: string; color: string }[] = [
  { key: "G57", label: "Akademik Matematik",  weight: "%40", color: "bg-brand" },
  { key: "G58", label: "İleri Matematik",     weight: "%30", color: "bg-blue-500" },
  { key: "G59", label: "Mat. Okuryazarlığı",  weight: "%30", color: "bg-emerald-500" },
]

export default function OgrenciPage() {
  const { user } = useAuthStore()
  const [exams, setExams]   = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sinav/raporlar")
      .then(r => r.json())
      .then(d => { setExams(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const latest = exams[0] ?? null

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!latest?.result) return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Hoş Geldiniz, {user?.name}</h1>
        <p className="text-muted text-[15px] mt-1">Henüz tamamlanmış bir sınavınız bulunmuyor.</p>
      </div>
      <div className="bg-white rounded-2xl border border-surface-section p-12 flex flex-col items-center gap-5">
        <div className="bg-brand-light rounded-2xl p-5"><BookOpen className="w-10 h-10 text-brand" /></div>
        <div className="text-center">
          <p className="text-[16px] font-bold text-brand mb-1">Sınavınız henüz atanmamış</p>
          <p className="text-muted text-[14px] max-w-sm">Öğretmeniniz sınav atadıktan sonra sonuçlarınız burada görünecek.</p>
        </div>
        <Link href="/ogrenci/sinav" className="bg-brand text-white rounded-full px-6 py-3 text-[14px] font-semibold hover:bg-brand-dark transition-colors">
          Sınavlarıma Git →
        </Link>
      </div>
    </div>
  )

  const { result, stats, grade, createdAt } = latest
  const lv           = LEVELS[result.level] ?? LEVELS.B1
  const generalScore = Math.round(result.G76)
  const C            = 251.33
  const totalQ = Object.values(stats).reduce((a, s) => a + s.correct + s.wrong + s.blank, 0)
  const totalC = Object.values(stats).reduce((a, s) => a + s.correct, 0)
  const totalW = Object.values(stats).reduce((a, s) => a + s.wrong, 0)
  const totalB = Object.values(stats).reduce((a, s) => a + s.blank, 0)
  const pct    = totalQ > 0 ? Math.round(totalC / totalQ * 100) : 0

  return (
    <div className="flex flex-col gap-5">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-brand">Hoş Geldiniz, {user?.name}</h1>
        <p className="text-muted text-[15px] mt-1">
          Son sınav: {new Date(createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} · {grade}. Sınıf
        </p>
      </div>

      {/* Satır 1 — Level | Genel puan | Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Level kartı */}
        <div className={`${lv.bg} border ${lv.border} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}>
          <div className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mb-3">Genel Beceri Düzeyi</div>
          <div className={`text-[72px] font-black ${lv.text} leading-none mb-1`}>{result.level}</div>
          <div className={`text-[14px] font-semibold ${lv.text} mb-5`}>{lv.label}</div>
          <div className="w-full">
            <div className="flex justify-between mb-1.5">
              {LEVEL_KEYS.map(k => (
                <span key={k} className={`text-[9px] font-bold ${k === result.level ? lv.text : "text-brand/20"}`}>{k}</span>
              ))}
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${lv.bar}`} style={{ width: `${(lv.idx + 1) / 6 * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Genel puan halkası */}
        <div className="bg-white border border-surface-section rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mb-4">Genel Puan (G76)</div>
          <div className="relative w-32 h-32 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f2f6" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={lv.ring} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${generalScore / 100 * C} ${C}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[30px] font-black text-brand leading-none">{generalScore}</span>
              <span className="text-[10px] text-muted font-medium">/100</span>
            </div>
          </div>
          <p className="text-[12px] text-muted">PISA–TIMSS standartına göre</p>
        </div>

        {/* Sınav özeti */}
        <div className="bg-white border border-surface-section rounded-2xl p-6">
          <div className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mb-4">Sınav Özeti</div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Toplam Soru", value: totalQ, cls: "text-brand" },
              { label: "Doğru",       value: totalC, cls: "text-emerald-600" },
              { label: "Yanlış",      value: totalW, cls: "text-red-500" },
              { label: "Boş",         value: totalB, cls: "text-muted" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[14px] text-brand/70">{label}</span>
                <span className={`text-[22px] font-black ${cls}`}>{value}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-surface-section flex items-center justify-between">
              <span className="text-[12px] text-muted">Başarı Oranı</span>
              <span className="text-[17px] font-black text-brand">%{pct}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Satır 2 — Kategori bazlı */}
      <div className="bg-white border border-surface-section rounded-2xl p-6">
        <div className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mb-6">Kategori Bazlı Sonuçlar</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATS.map(cat => {
            const score = Math.round(result[cat.key])
            const s     = stats[cat.key]
            return (
              <div key={cat.key}>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="font-semibold text-brand text-[14px]">{cat.label}</div>
                    <div className="text-[11px] text-muted">Ağırlık {cat.weight}</div>
                  </div>
                  <span className="text-[30px] font-black text-brand">{score}</span>
                </div>
                <div className="h-2.5 bg-surface-section rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${score}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50 rounded-xl py-2.5">
                    <div className="text-[17px] font-black text-emerald-600">{s.correct}</div>
                    <div className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wide">Doğru</div>
                  </div>
                  <div className="bg-red-50 rounded-xl py-2.5">
                    <div className="text-[17px] font-black text-red-500">{s.wrong}</div>
                    <div className="text-[9px] font-semibold text-red-400 uppercase tracking-wide">Yanlış</div>
                  </div>
                  <div className="bg-surface-section rounded-xl py-2.5">
                    <div className="text-[17px] font-black text-muted">{s.blank}</div>
                    <div className="text-[9px] font-semibold text-muted uppercase tracking-wide">Boş</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Satır 3 — Geçmiş + CTA */}
      <div className={`grid grid-cols-1 ${exams.length > 1 ? "md:grid-cols-2" : ""} gap-4`}>

        {exams.length > 1 && (
          <div className="bg-white border border-surface-section rounded-2xl p-6">
            <div className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mb-4">Sınav Geçmişi</div>
            <div className="flex flex-col">
              {exams.slice(0, 5).map(exam => {
                const el = LEVELS[exam.result?.level ?? "B1"] ?? LEVELS.B1
                return (
                  <div key={exam.id} className="flex items-center justify-between py-3 border-b border-surface-section last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${el.bg} ${el.text} ${el.border}`}>
                        {exam.result?.level ?? "—"}
                      </span>
                      <div>
                        <div className="text-[13px] font-semibold text-brand">{exam.grade}. Sınıf</div>
                        <div className="text-[11px] text-muted">{new Date(exam.createdAt).toLocaleDateString("tr-TR")}</div>
                      </div>
                    </div>
                    <span className="text-[18px] font-black text-brand">{Math.round(exam.result?.G76 ?? 0)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-brand rounded-2xl p-7 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Sıradaki Adım</div>
            <h3 className="text-white font-bold text-[22px] leading-tight mb-2">
              Gelişimini<br />Takip Et
            </h3>
            <p className="text-white/60 text-[13px] leading-relaxed">
              Yeni sınavlar ve detaylı raporlarla gelişimini izle, hedef düzeye ulaş.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/ogrenci/sinav"
              className="bg-accent-yellow text-brand rounded-full py-3 text-center font-bold text-[14px] hover:opacity-90 transition-opacity">
              Sınavlarıma Git →
            </Link>
            <Link href="/ogrenci/raporlarim"
              className="bg-white/10 text-white rounded-full py-3 text-center font-semibold text-[14px] hover:bg-white/20 transition-colors">
              Raporlarım
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
