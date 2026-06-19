"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Edit } from "lucide-react"
import { TedarikciModal } from "@/components/sistem-yoneticisi/TedarikciModal"
import type { SupplierDetail } from "@/types/admin"

type Tab = "genel" | "ogrenciler" | "kullanicilar"

export default function TedarikciDetayPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("genel")
  const [showModal, setShowModal] = useState(false)
  const [toggling, setToggling] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tedarikciler/${id}`)
      if (!res.ok) throw new Error("Tedarikci bulunamadi.")
      setSupplier(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const toggleActive = async () => {
    if (!supplier) return
    setToggling(true)
    await fetch(`/api/admin/tedarikciler/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !supplier.isActive }),
    })
    await load()
    setToggling(false)
  }

  if (loading) return <div className="animate-pulse bg-brand-light rounded-2xl h-64" />
  if (error || !supplier) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>

  const TABS = [
    { key: "genel" as Tab, label: "Genel Bilgi" },
    { key: "ogrenciler" as Tab, label: `Atanmis Ogrenciler (${supplier.students.length})` },
    { key: "kullanicilar" as Tab, label: `Sorumlular (${supplier.users.length})` },
  ]

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-brand transition-colors text-[14px] w-fit">
        <ChevronLeft className="w-4 h-4" />
        Tedarikciler
      </button>

      <div className="bg-white rounded-2xl border border-form-border p-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand">{supplier.name}</h1>
            {supplier.isActive
              ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
              : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
            }
          </div>
          <p className="text-muted text-[14px] mt-1">{supplier.phone ?? ""} {supplier.address ? `· ${supplier.address}` : ""}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 border border-form-border text-brand rounded-xl px-4 py-2 text-[14px] font-medium hover:bg-surface transition-colors">
            <Edit className="w-4 h-4" />
            Duzenle
          </button>
          <button onClick={toggleActive} disabled={toggling} className={`rounded-xl px-4 py-2 text-[14px] font-medium transition-colors disabled:opacity-60 ${supplier.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
            {supplier.isActive ? "Pasife Al" : "Aktife Al"}
          </button>
        </div>
      </div>

      <div className="flex border-b border-form-border gap-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`pb-3 text-[14px] font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        {tab === "genel" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Telefon", value: supplier.phone ?? "—" },
              { label: "Adres", value: supplier.address ?? "—" },
              { label: "Atanmis Ogrenci", value: supplier._count.students },
              { label: "Sorumlu Kullanici", value: supplier._count.users },
              { label: "Kayit Tarihi", value: new Date(supplier.createdAt).toLocaleDateString("tr-TR") },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[12px] text-muted uppercase tracking-wide">{label}</p>
                <p className="text-[15px] font-semibold text-brand mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "ogrenciler" && (
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ad Soyad", "Email", "Okul", "Durum"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplier.students.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted text-[14px]">Atanmis ogrenci bulunamadi.</td></tr>
              ) : supplier.students.map((ss) => (
                <tr key={ss.id} className="border-t border-form-border">
                  <td className="px-6 py-4 text-[14px] font-medium text-brand">{ss.student.user.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{ss.student.user.email}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{ss.student.school?.name ?? "—"}</td>
                  <td className="px-6 py-4">
                    {ss.isActive
                      ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                      : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "kullanicilar" && (
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ad Soyad", "Email", "Durum"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplier.users.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-muted text-[14px]">Sorumlu bulunamadi.</td></tr>
              ) : supplier.users.map((u) => (
                <tr key={u.id} className="border-t border-form-border">
                  <td className="px-6 py-4 text-[14px] font-medium text-brand">{u.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.isActive
                      ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
                      : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TedarikciModal isOpen={showModal} onClose={() => setShowModal(false)} tedarikci={supplier} onSuccess={load} />
    </div>
  )
}
