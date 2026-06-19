"use client"

import { useEffect, useState } from "react"
import { UserCircle } from "lucide-react"

interface Student {
  id: string
  name: string
  username: string
  school: string | null
  classroom: string | null
  grade: number | null
  lastExam: { g76: number | null; level: string | null } | null
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-red-100 text-red-700",
  A2: "bg-orange-100 text-orange-700",
  B1: "bg-yellow-100 text-yellow-700",
  B2: "bg-blue-100 text-blue-700",
  C1: "bg-green-100 text-green-700",
  C2: "bg-emerald-100 text-emerald-700",
}

export default function TedarikciOgrencilerPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/tedarikci/ogrenciler")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => setError("Veriler yuklenemedi."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Ogrencilerim</h1>
        <p className="text-muted text-[14px] mt-0.5">{students.length} ogrenci atanmis</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-section">
            <tr>
              {["Ad Soyad", "Kullanici Adi", "Okul", "Sinif", "Son Sinav", "Skor"].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-form-border">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4"><div className="animate-pulse bg-brand-light rounded h-4 w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <UserCircle className="w-10 h-10 text-muted/30" />
                    <p className="text-muted text-[14px]">Size atanmis ogrenci bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : students.map((s) => (
              <tr key={s.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-semibold text-brand">{s.name}</td>
                <td className="px-6 py-4 text-[14px] text-muted font-mono">{s.username}</td>
                <td className="px-6 py-4 text-[14px] text-muted">{s.school ?? "—"}</td>
                <td className="px-6 py-4 text-[14px] text-muted">{s.classroom ?? "—"}</td>
                <td className="px-6 py-4">
                  {s.lastExam?.level ? (
                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${LEVEL_COLORS[s.lastExam.level] ?? "bg-gray-100 text-gray-700"}`}>
                      {s.lastExam.level}
                    </span>
                  ) : (
                    <span className="text-muted text-[13px]">Henuz yok</span>
                  )}
                </td>
                <td className="px-6 py-4 text-[14px] text-brand font-semibold tabular-nums">
                  {s.lastExam?.g76 != null ? `${s.lastExam.g76.toFixed(1)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
