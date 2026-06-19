"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

interface TeacherRow {
  id: string
  name: string
  email: string | null
  username: string | null
  isActive: boolean
  classrooms: { id: string; name: string; grade: number; _count: { students: number } }[]
}

export default function OkulOgretmenlerPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/okul-yoneticisi/ogretmenler")
      .then((r) => r.json())
      .then(setTeachers)
      .catch(() => setError("Veriler yuklenemedi."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Ogretmenler</h1>
        <p className="text-muted text-[14px] mt-0.5">{teachers.length} ogretmen kayitli</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-section">
            <tr>
              {["Ad Soyad", "Kullanici / Email", "Siniflar", "Durum"].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-form-border">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <td key={j} className="px-6 py-4"><div className="animate-pulse bg-brand-light rounded h-4 w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-10 h-10 text-muted/30" />
                    <p className="text-muted text-[14px]">Ogretmen bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : teachers.map((t) => (
              <tr key={t.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-semibold text-brand">{t.name}</td>
                <td className="px-6 py-4 text-[14px] text-muted font-mono">{t.username ?? t.email ?? "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {t.classrooms.length === 0 ? (
                      <span className="text-muted text-[13px]">Sinif yok</span>
                    ) : t.classrooms.map((c) => (
                      <span key={c.id} className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">
                        {c.name} ({c._count.students})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {t.isActive
                    ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                    : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
