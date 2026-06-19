"use client"

import { useEffect, useState, useCallback } from "react"
import { BookCheck, UserCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface StudentRow {
  id: string
  name: string
  username: string
  school: string | null
  classroom: string | null
  activeExam: "PENDING" | "IN_PROGRESS" | null
  lastExam: { g76: number | null; level: string | null } | null
}

export default function TedarikciSinavBaslatPage() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/tedarikci/ogrenciler")
      if (!res.ok) throw new Error()
      setStudents(await res.json())
    } catch {
      setError("Veriler yuklenemedi.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const createExam = async (studentId: string, studentName: string) => {
    setCreating(studentId)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch("/api/tedarikci/sinav-olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? "Hata olustu.")
      } else {
        setSuccess(`${studentName} icin sinav olusturuldu. Ogrenci giris yaparak sinava girebilir.`)
        await load()
      }
    } catch {
      setError("Baglanti hatasi.")
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Sinav Baslat</h1>
        <p className="text-muted text-[14px] mt-0.5">Ogrenciler icin sinav olusturun. Ogrenci giris yaptiginda sinavi gorecektir.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 text-[14px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700 text-[14px]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-section">
            <tr>
              {["Ogrenci", "Okul / Sinif", "Sinav Durumu", "Islem"].map((h) => (
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
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <UserCircle className="w-10 h-10 text-muted/30" />
                    <p className="text-muted text-[14px]">Size atanmis ogrenci bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : students.map((s) => (
              <tr key={s.id} className="border-t border-form-border">
                <td className="px-6 py-4">
                  <p className="text-[14px] font-semibold text-brand">{s.name}</p>
                  <p className="text-[12px] text-muted font-mono">{s.username}</p>
                </td>
                <td className="px-6 py-4 text-[14px] text-muted">
                  {s.school ?? "—"}{s.classroom ? ` / ${s.classroom}` : ""}
                </td>
                <td className="px-6 py-4">
                  {s.activeExam === "IN_PROGRESS" && (
                    <span className="bg-yellow-100 text-yellow-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Devam Ediyor</span>
                  )}
                  {s.activeExam === "PENDING" && (
                    <span className="bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Beklemede</span>
                  )}
                  {!s.activeExam && (
                    <span className="text-muted text-[13px]">{s.lastExam ? "Tamamlandi" : "Sinav yok"}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {s.activeExam ? (
                    <span className="text-muted text-[13px]">Aktif sinav mevcut</span>
                  ) : (
                    <button
                      onClick={() => createExam(s.id, s.name)}
                      disabled={creating === s.id}
                      className="flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2 text-[13px] font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
                    >
                      {creating === s.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <BookCheck className="w-3.5 h-3.5" />
                      }
                      Sinav Olustur
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
