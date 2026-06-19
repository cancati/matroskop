"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, BookOpen, Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { SoruModal } from "@/components/sistem-yoneticisi/SoruModal"
import type { QuestionData, PaginatedResponse } from "@/types/admin"

export default function SoruBankasiPage() {
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)
      if (gradeFilter) params.set("grade", gradeFilter)
      const res = await fetch(`/api/admin/sorular?${params}`)
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      const json: PaginatedResponse<QuestionData> = await res.json()
      setQuestions(json.data)
      setTotal(json.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [page, search, gradeFilter])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditingQuestion(null); setShowModal(true) }
  const openEdit = (q: QuestionData) => { setEditingQuestion(q); setShowModal(true) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Soru Bankasi</h1>
          <p className="text-muted text-[14px] mt-0.5">{total} soru kayitli</p>
        </div>
        <button onClick={openAdd} className="bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Soru Ekle
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Soru ara..."
            className="w-full border border-form-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
          />
        </div>
        <select
          value={gradeFilter}
          onChange={(e) => { setGradeFilter(e.target.value); setPage(1) }}
          className="border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        >
          <option value="">Tum Siniflar</option>
          {[1,2,3,4,5,6,7,8].map((g) => <option key={g} value={g}>{g}. Sinif</option>)}
        </select>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["#", "Soru Metni", "Kategori", "Havuz", "Sinif", "Durum", "Islemler"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-form-border">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="animate-pulse bg-brand-light rounded h-4 w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="w-10 h-10 text-muted/30" />
                      <p className="text-muted text-[14px]">Soru bulunamadi.</p>
                    </div>
                  </td>
                </tr>
              ) : questions.map((q, idx) => (
                <tr key={q.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 text-muted text-[13px]">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-6 py-4 text-brand text-[14px] max-w-[320px]">
                    <span className="line-clamp-2">{q.content}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">{q.category}</span>
                  </td>
                  <td className="px-6 py-4 text-muted text-[13px] font-mono">{q.poolId}</td>
                  <td className="px-6 py-4 text-muted text-[14px]">{q.grade}. Sinif</td>
                  <td className="px-6 py-4">
                    {q.isActive
                      ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                      : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(q)} className="text-muted hover:text-brand transition-colors p-1"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > limit && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-form-border">
            <p className="text-muted text-[13px]">{(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total} kayit</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="border border-form-border rounded-xl p-2 text-brand hover:bg-surface disabled:opacity-40 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="border border-form-border rounded-xl p-2 text-brand hover:bg-surface disabled:opacity-40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <SoruModal isOpen={showModal} onClose={() => setShowModal(false)} soru={editingQuestion} onSuccess={load} />
    </div>
  )
}
