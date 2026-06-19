"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowLeftRight, AlertCircle, CheckCircle2, Plus } from "lucide-react"

interface TransferRow {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  studentName: string
  fromSchool: string | null
  toSchool: string
  note: string | null
  requestedAt: string
  resolvedAt: string | null
}

interface StudentOption { id: string; name: string; username: string }

const STATUS_STYLES: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Beklemede", APPROVED: "Onaylandi", REJECTED: "Reddedildi",
}

export default function OkulTransferPage() {
  const [transfers, setTransfers] = useState<TransferRow[]>([])
  const [students, setStudents] = useState<StudentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ studentId: "", toSchoolId: "", note: "" })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, sRes] = await Promise.all([
        fetch("/api/okul-yoneticisi/transfer"),
        fetch("/api/okul-yoneticisi/ogrenciler"),
      ])
      setTransfers(tRes.ok ? await tRes.json() : [])
      const ogrenciler = sRes.ok ? await sRes.json() : []
      setStudents(ogrenciler.map((s: StudentOption & { classroom: string | null }) => ({ id: s.id, name: s.name, username: s.username })))
    } catch {
      setError("Veriler yuklenemedi.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const submit = async () => {
    if (!form.studentId || !form.toSchoolId) {
      setError("Ogrenci ve hedef okul zorunludur.")
      return
    }
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/okul-yoneticisi/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? "Hata olustu.")
      } else {
        setSuccess("Transfer talebi olusturuldu.")
        setShowForm(false)
        setForm({ studentId: "", toSchoolId: "", note: "" })
        await load()
      }
    } catch {
      setError("Baglanti hatasi.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Transfer Talebi</h1>
          <p className="text-muted text-[14px] mt-0.5">Ogrenci transfer taleplerini yonetin</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Talep
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 text-[14px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700 text-[14px]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-form-border p-6 flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-brand">Yeni Transfer Talebi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-muted mb-1.5">Ogrenci</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="">Ogrenci secin...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] text-muted mb-1.5">Hedef Okul ID</label>
              <input
                value={form.toSchoolId}
                onChange={(e) => setForm((f) => ({ ...f, toSchoolId: e.target.value }))}
                placeholder="Hedef okul ID giriniz"
                className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] text-muted mb-1.5">Not (opsiyonel)</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              rows={2}
              placeholder="Transfer nedeni..."
              className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={submit}
              disabled={submitting}
              className="bg-brand text-white rounded-xl px-6 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Gonderiliyor..." : "Talebi Gonder"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-form-border rounded-xl px-6 py-2.5 text-[14px] text-muted hover:bg-surface transition-colors"
            >
              Iptal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-section">
            <tr>
              {["Ogrenci", "Gidecegi Okul", "Durum", "Tarih"].map((h) => (
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
            ) : transfers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ArrowLeftRight className="w-10 h-10 text-muted/30" />
                    <p className="text-muted text-[14px]">Transfer talebi bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : transfers.map((t) => (
              <tr key={t.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-semibold text-brand">{t.studentName}</td>
                <td className="px-6 py-4 text-[14px] text-muted">{t.toSchool}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${STATUS_STYLES[t.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {STATUS_LABELS[t.status] ?? t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[14px] text-muted">
                  {new Date(t.requestedAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
