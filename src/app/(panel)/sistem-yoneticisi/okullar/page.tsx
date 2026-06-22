"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Search, School, Edit, ExternalLink, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { OkulModal } from "@/components/sistem-yoneticisi/OkulModal"
import type { SchoolWithCount, PaginatedResponse } from "@/types/admin"

const SKELETON_ROWS = 5

export default function OkullarPage() {
  const [schools, setSchools] = useState<SchoolWithCount[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState<SchoolWithCount | null>(null)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)
      if (isActiveFilter !== null) params.set("isActive", String(isActiveFilter))
      const res = await fetch(`/api/admin/okullar?${params}`)
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      const json: PaginatedResponse<SchoolWithCount> = await res.json()
      setSchools(json.data)
      setTotal(json.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [page, search, isActiveFilter])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditingSchool(null); setShowModal(true) }
  const openEdit = (s: SchoolWithCount) => { setEditingSchool(s); setShowModal(true) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Okullar</h1>
          <p className="text-muted text-[14px] mt-0.5">{total} okul kayitli</p>
        </div>
        <button onClick={openAdd} className="bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Okul Ekle
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Okul ara..."
            className="w-full border border-form-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
          />
        </div>
        <button
          onClick={() => { setIsActiveFilter(isActiveFilter === true ? null : true); setPage(1) }}
          className={`px-4 py-2.5 rounded-xl text-[14px] font-medium border transition-colors ${
            isActiveFilter === true ? "bg-brand text-white border-brand" : "border-form-border text-brand hover:bg-surface"
          }`}
        >
          Sadece Aktif
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Okul Adi", "Sehir", "Telefon", "Ogrenci", "Kullanici", "Durum", "Islemler"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="border-t border-form-border">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="animate-pulse bg-brand-light rounded h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <School className="w-10 h-10 text-muted/30" />
                      <p className="text-muted text-[14px]">Hicbir okul bulunamadi.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                schools.map((s) => (
                  <tr key={s.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-brand text-[14px]">{s.name}</td>
                    <td className="px-6 py-4 text-muted text-[14px]">{s.city ?? "—"}</td>
                    <td className="px-6 py-4 text-muted text-[14px]">{s.phone ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">{s._count.students}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">{s._count.users}</span>
                    </td>
                    <td className="px-6 py-4">
                      {s.isActive
                        ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                        : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="text-muted hover:text-brand transition-colors p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <Link href={`/sistem-yoneticisi/okullar/${s.id}`} className="text-muted hover:text-brand transition-colors p-1">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > limit && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-form-border">
            <p className="text-muted text-[13px]">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total} kayit
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="border border-form-border rounded-xl p-2 text-brand hover:bg-surface disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="border border-form-border rounded-xl p-2 text-brand hover:bg-surface disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <OkulModal isOpen={showModal} onClose={() => setShowModal(false)} okul={editingSchool} onSuccess={load} />
    </div>
  )
}
