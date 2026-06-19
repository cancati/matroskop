"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Edit } from "lucide-react"
import { OkulModal } from "@/components/sistem-yoneticisi/OkulModal"
import type { SchoolDetail } from "@/types/admin"

type Tab = "genel" | "ogretmenler" | "ogrenciler" | "siniflar"

export default function OkulDetayPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [school, setSchool] = useState<SchoolDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("genel")
  const [showModal, setShowModal] = useState(false)
  const [toggling, setToggling] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/okullar/${id}`)
      if (!res.ok) throw new Error("Okul bulunamadi.")
      setSchool(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const toggleActive = async () => {
    if (!school) return
    setToggling(true)
    await fetch(`/api/admin/okullar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !school.isActive }),
    })
    await load()
    setToggling(false)
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "genel", label: "Genel Bilgi" },
    { key: "ogretmenler", label: `Ogretmenler (${school?.users.filter((u) => u.role === "TEACHER").length ?? 0})` },
    { key: "ogrenciler", label: `Ogrenciler (${school?.students.length ?? 0})` },
    { key: "siniflar", label: `Siniflar (${school?.classrooms.length ?? 0})` },
  ]

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse bg-brand-light rounded-2xl h-32" />
        <div className="animate-pulse bg-brand-light rounded-2xl h-64" />
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">
        {error ?? "Okul bulunamadi."}
      </div>
    )
  }

  const teachers = school.users.filter((u) => u.role === "TEACHER")

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-brand transition-colors text-[14px] w-fit">
        <ChevronLeft className="w-4 h-4" />
        Okullar
      </button>

      <div className="bg-white rounded-2xl border border-form-border p-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand">{school.name}</h1>
            {school.isActive
              ? <span className="bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Aktif</span>
              : <span className="bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 text-[12px] font-medium">Pasif</span>
            }
          </div>
          <p className="text-muted text-[14px] mt-1">{school.city} {school.phone ? `· ${school.phone}` : ""}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 border border-form-border text-brand rounded-xl px-4 py-2 text-[14px] font-medium hover:bg-surface transition-colors">
            <Edit className="w-4 h-4" />
            Duzenle
          </button>
          <button
            onClick={toggleActive}
            disabled={toggling}
            className={`rounded-xl px-4 py-2 text-[14px] font-medium transition-colors disabled:opacity-60 ${
              school.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {school.isActive ? "Pasife Al" : "Aktife Al"}
          </button>
        </div>
      </div>

      <div className="flex border-b border-form-border gap-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 text-[14px] font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
        {tab === "genel" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Sehir", value: school.city ?? "—" },
              { label: "Telefon", value: school.phone ?? "—" },
              { label: "Toplam Ogrenci", value: school._count.students },
              { label: "Toplam Kullanici", value: school._count.users },
              { label: "Sinif Sayisi", value: school._count.classrooms },
              { label: "Kayit Tarihi", value: new Date(school.createdAt).toLocaleDateString("tr-TR") },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[12px] text-muted uppercase tracking-wide">{label}</p>
                <p className="text-[15px] font-semibold text-brand mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "ogretmenler" && (
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ad Soyad", "Email", "Durum"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-muted text-[14px]">Ogretmen bulunamadi.</td></tr>
              ) : teachers.map((u) => (
                <tr key={u.id} className="border-t border-form-border">
                  <td className="px-6 py-4 text-[14px] font-medium text-brand">{u.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{u.username ?? u.email ?? "—"}</td>
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

        {tab === "ogrenciler" && (
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Ad Soyad", "Kullanici Adi", "Sinif", "Tedarikci"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {school.students.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted text-[14px]">Ogrenci bulunamadi.</td></tr>
              ) : school.students.map((s) => (
                <tr key={s.id} className="border-t border-form-border">
                  <td className="px-6 py-4 text-[14px] font-medium text-brand">{s.user.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted font-mono">{s.user.username ?? s.user.email ?? "—"}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{s.classroom?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">
                    {s.suppliers[0]?.supplier.name ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "siniflar" && (
          <table className="w-full">
            <thead className="bg-surface-section">
              <tr>
                {["Sinif Adi", "Seviye", "Ogretmen", "Ogrenci"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {school.classrooms.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted text-[14px]">Sinif bulunamadi.</td></tr>
              ) : school.classrooms.map((c) => (
                <tr key={c.id} className="border-t border-form-border">
                  <td className="px-6 py-4 text-[14px] font-medium text-brand">{c.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{c.grade}. Sinif</td>
                  <td className="px-6 py-4 text-[14px] text-muted">{c.teacher.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-brand-light text-brand rounded-full px-2.5 py-0.5 text-[12px] font-medium">{c._count.students}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <OkulModal isOpen={showModal} onClose={() => setShowModal(false)} okul={school} onSuccess={load} />
    </div>
  )
}
