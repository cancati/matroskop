"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GraduationCap, Users, BookCheck, Clock, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"

interface DashboardData {
  totalClassrooms: number
  totalStudents: number
  examStats: { completed: number; pending: number }
  levelDistribution: Record<string, number>
  recentExams: {
    id: string
    studentName: string
    classroom: string
    g76: number | null
    level: string | null
    endedAt: string | null
  }[]
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-red-100 text-red-700",
  A2: "bg-orange-100 text-orange-700",
  B1: "bg-yellow-100 text-yellow-700",
  B2: "bg-blue-100 text-blue-700",
  C1: "bg-green-100 text-green-700",
  C2: "bg-emerald-100 text-emerald-700",
}

const LEVEL_BAR_COLORS: Record<string, string> = {
  A1: "bg-red-400",
  A2: "bg-orange-400",
  B1: "bg-yellow-400",
  B2: "bg-blue-400",
  C1: "bg-green-500",
  C2: "bg-emerald-500",
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

export default function OgretmenPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ogretmen/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const maxLevel = data
    ? Math.max(1, ...Object.values(data.levelDistribution))
    : 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Hos Geldiniz, {user?.name}</h1>
          <p className="text-muted text-[14px] mt-0.5">Ogretmen paneline hos geldiniz.</p>
        </div>
        <Link
          href="/ogretmen/sinifim"
          className="flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors"
        >
          Sinifima Git
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Sinif Sayisi",
            value: data?.totalClassrooms ?? "—",
            icon: GraduationCap,
            loading,
          },
          {
            label: "Toplam Ogrenci",
            value: data?.totalStudents ?? "—",
            icon: Users,
            loading,
          },
          {
            label: "Tamamlanan Sinav",
            value: data?.examStats.completed ?? "—",
            icon: BookCheck,
            loading,
          },
          {
            label: "Bekleyen Sinav",
            value: data?.examStats.pending ?? "—",
            icon: Clock,
            loading,
          },
        ].map(({ label, value, icon: Icon, loading: l }) => (
          <div key={label} className="bg-white rounded-2xl border border-form-border p-5 flex flex-col gap-3">
            <div className="bg-brand-light rounded-xl p-2.5 w-fit">
              <Icon className="w-5 h-5 text-brand" />
            </div>
            {l ? (
              <div className="animate-pulse bg-brand-light rounded h-7 w-1/2" />
            ) : (
              <p className="text-2xl font-black text-brand tabular-nums">{value}</p>
            )}
            <p className="text-[13px] text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Son sınavlar */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-form-border overflow-hidden">
          <div className="px-6 py-4 border-b border-form-border">
            <h2 className="text-[15px] font-semibold text-brand">Son Sinavlar</h2>
          </div>
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ogrenci", "Sinif", "Skor", "Seviye", "Tarih"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-form-border">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="animate-pulse bg-brand-light rounded h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data || data.recentExams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted text-[14px]">
                    Henuz tamamlanmis sinav yok.
                  </td>
                </tr>
              ) : data.recentExams.map((e) => (
                <tr key={e.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-brand">{e.studentName}</td>
                  <td className="px-5 py-3.5 text-[13px] text-muted">{e.classroom}</td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-brand tabular-nums">
                    {e.g76 != null ? e.g76.toFixed(1) : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {e.level ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${LEVEL_COLORS[e.level] ?? "bg-gray-100 text-gray-700"}`}>
                        {e.level}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted">
                    {e.endedAt
                      ? new Date(e.endedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.recentExams.length > 0 && (
            <div className="px-5 py-3 border-t border-form-border">
              <Link href="/ogretmen/raporlar" className="text-[13px] text-brand/70 hover:text-brand transition-colors">
                Tum raporlari gor →
              </Link>
            </div>
          )}
        </div>

        {/* Seviye dağılımı */}
        <div className="bg-white rounded-2xl border border-form-border p-6 flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-brand">Seviye Dagilimi</h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {LEVELS.map((l) => (
                <div key={l} className="animate-pulse bg-brand-light rounded h-8" />
              ))}
            </div>
          ) : !data || data.examStats.completed === 0 ? (
            <p className="text-muted text-[13px] mt-2">Henuz tamamlanmis sinav yok.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {LEVELS.map((level) => {
                const count = data.levelDistribution[level] ?? 0
                const pct = Math.round((count / maxLevel) * 100)
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[level]}`}>{level}</span>
                      <span className="text-[13px] text-muted tabular-nums">{count} ogrenci</span>
                    </div>
                    <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${LEVEL_BAR_COLORS[level]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
