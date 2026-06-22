"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, Users, Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { KullaniciModal } from "@/components/sistem-yoneticisi/KullaniciModal"
import type { UserWithRelations, PaginatedResponse } from "@/types/admin"
import type { UserRole } from "@/types/user"

const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Sistem Yoneticisi",
  SCHOOL_ADMIN: "Okul Yoneticisi",
  TEACHER: "Ogretmen",
  STUDENT: "Ogrenci",
  SUPPLIER: "Tedarikci",
}

const ROLE_BADGE: Record<UserRole, string> = {
  SYSTEM_ADMIN: "bg-red-100 text-red-700",
  SCHOOL_ADMIN: "bg-blue-100 text-blue-700",
  TEACHER:      "bg-green-100 text-green-700",
  STUDENT:      "bg-purple-100 text-purple-700",
  SUPPLIER:     "bg-orange-100 text-orange-700",
}

export default function KullanicilarPage() {
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithRelations | null>(null)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)
      if (roleFilter) params.set("role", roleFilter)
      const res = await fetch(`/api/admin/kullanicilar?${params}`)
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      const json: PaginatedResponse<UserWithRelations> = await res.json()
      setUsers(json.data)
      setTotal(json.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditingUser(null); setShowModal(true) }
  const openEdit = (u: UserWithRelations) => { setEditingUser(u); setShowModal(true) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Kullanicilar</h1>
          <p className="text-muted text-[14px] mt-0.5">{total} kullanici kayitli</p>
        </div>
        <button onClick={openAdd} className="bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kullanici
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Ad veya email ara..."
            className="w-full border border-form-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        >
          <option value="">Tum Roller</option>
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>}

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ad Soyad", "Email", "Rol", "Kurum", "Durum", "Islemler"].map((h) => (
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-10 h-10 text-muted/30" />
                      <p className="text-muted text-[14px]">Kullanici bulunamadi.</p>
                    </div>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-brand text-[14px]">{u.name}</td>
                  <td className="px-6 py-4 text-muted text-[14px]">{u.username ?? u.email ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${ROLE_BADGE[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-[14px]">{u.school?.name ?? u.supplier?.name ?? "—"}</td>
                  <td className="px-6 py-4">
                    {u.isActive
                      ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                      : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(u)} className="text-muted hover:text-brand transition-colors p-1"><Edit className="w-4 h-4" /></button>
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

      <KullaniciModal isOpen={showModal} onClose={() => setShowModal(false)} kullanici={editingUser} onSuccess={load} />
    </div>
  )
}
