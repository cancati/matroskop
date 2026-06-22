"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowLeftRight, Check, X } from "lucide-react"
import type { TransferWithRelations, PaginatedResponse } from "@/types/admin"

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED"

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "PENDING",  label: "Bekleyen" },
  { key: "APPROVED", label: "Onaylanan" },
  { key: "REJECTED", label: "Reddedilen" },
]

const STATUS_BADGE: Record<StatusFilter, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
}
const STATUS_LABEL: Record<StatusFilter, string> = {
  PENDING:  "Bekliyor",
  APPROVED: "Onaylandi",
  REJECTED: "Reddedildi",
}

export default function TransferlerPage() {
  const [transfers, setTransfers] = useState<TransferWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusFilter>("PENDING")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<"APPROVE" | "REJECT" | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/transferler?status=${status}`)
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      const json: PaginatedResponse<TransferWithRelations> = await res.json()
      setTransfers(json.data)
      setTotal(json.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { load() }, [load])

  const handleAction = async () => {
    if (!confirmId || !confirmAction) return
    setProcessingId(confirmId)
    setConfirmId(null)
    setConfirmAction(null)
    try {
      await fetch(`/api/admin/transferler/${confirmId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: confirmAction }),
      })
      load()
    } finally {
      setProcessingId(null)
    }
  }

  const askConfirm = (id: string, action: "APPROVE" | "REJECT") => {
    setConfirmId(id)
    setConfirmAction(action)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Transfer Talepleri</h1>
        <p className="text-muted text-[14px] mt-0.5">{total} kayit</p>
      </div>

      <div className="flex border-b border-form-border gap-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`pb-3 text-[14px] font-medium transition-colors border-b-2 -mb-px ${
              status === t.key ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setConfirmId(null); setConfirmAction(null) }} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-[16px] font-semibold text-brand mb-2">
              {confirmAction === "APPROVE" ? "Transferi Onayla" : "Transferi Reddet"}
            </h3>
            <p className="text-muted text-[14px] mb-5">
              {confirmAction === "APPROVE"
                ? "Bu transferi onaylamak istediginize emin misiniz? Ogrenci yeni okula aktarilacak."
                : "Bu transferi reddetmek istediginize emin misiniz?"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setConfirmId(null); setConfirmAction(null) }} className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors">
                Iptal
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                  confirmAction === "APPROVE" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmAction === "APPROVE" ? "Onayla" : "Reddet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ogrenci", "Mevcut Okul", "Hedef Okul", "Talep Tarihi", "Not", "Durum",
                  ...(status === "PENDING" ? ["Islemler"] : ["Cozum Tarihi"])
                ].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-form-border">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="animate-pulse bg-brand-light rounded h-4 w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ArrowLeftRight className="w-10 h-10 text-muted/30" />
                      <p className="text-muted text-[14px]">
                        {status === "PENDING" ? "Bekleyen transfer talebi yok." : "Kayit bulunamadi."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : transfers.map((t) => (
                <tr key={t.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand text-[14px]">{t.student.user.name}</p>
                    <p className="text-muted text-[12px]">{t.student.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-muted text-[14px]">{t.fromSchoolName ?? "—"}</td>
                  <td className="px-6 py-4 text-brand text-[14px] font-medium">{t.toSchoolName}</td>
                  <td className="px-6 py-4 text-muted text-[14px] whitespace-nowrap">
                    {new Date(t.requestedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-muted text-[14px] max-w-[160px] truncate">{t.note ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${STATUS_BADGE[t.status as StatusFilter]}`}>
                      {STATUS_LABEL[t.status as StatusFilter]}
                    </span>
                  </td>
                  {status === "PENDING" ? (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => askConfirm(t.id, "APPROVE")}
                          disabled={processingId === t.id}
                          className="bg-green-500 text-white rounded-xl px-3 py-1.5 text-[13px] hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Onayla
                        </button>
                        <button
                          onClick={() => askConfirm(t.id, "REJECT")}
                          disabled={processingId === t.id}
                          className="bg-red-500 text-white rounded-xl px-3 py-1.5 text-[13px] hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reddet
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className="px-6 py-4 text-muted text-[14px] whitespace-nowrap">
                      {t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString("tr-TR") : "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
