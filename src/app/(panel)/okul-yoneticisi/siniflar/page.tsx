"use client"

import { useEffect, useState } from "react"
import { GraduationCap } from "lucide-react"

interface ClassroomRow {
  id: string
  name: string
  grade: number
  teacher: { name: string }
  _count: { students: number }
}

export default function OkulSiniflarPage() {
  const [classrooms, setClassrooms] = useState<ClassroomRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/okul-yoneticisi/siniflar")
      .then((r) => r.json())
      .then(setClassrooms)
      .catch(() => setError("Veriler yuklenemedi."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Siniflar</h1>
        <p className="text-muted text-[14px] mt-0.5">{classrooms.length} sinif kayitli</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-section">
            <tr>
              {["Sinif", "Seviye", "Ogretmen", "Ogrenci"].map((h) => (
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
            ) : classrooms.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <GraduationCap className="w-10 h-10 text-muted/30" />
                    <p className="text-muted text-[14px]">Sinif bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : classrooms.map((c) => (
              <tr key={c.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-semibold text-brand">{c.name}</td>
                <td className="px-6 py-4 text-[14px] text-muted">{c.grade}. Sinif</td>
                <td className="px-6 py-4 text-[14px] text-muted">{c.teacher.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">
                    {c._count.students} ogrenci
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
