"use client"

import { useEffect, useState, useCallback } from "react"
import { GraduationCap, Plus, X, Copy, Check, Users } from "lucide-react"

interface Student {
  id: string
  createdAt: string
  user: { id: string; name: string; username: string | null; isActive: boolean }
}

interface Classroom {
  id: string
  name: string
  grade: number
  students: Student[]
}

interface NewCredential {
  name: string
  username: string
  plainPassword: string
}

export default function SinifimPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [modalClassroomId, setModalClassroomId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [credential, setCredential] = useState<NewCredential | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/teacher/sinifim")
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      const data: Classroom[] = await res.json()
      setClassrooms(data)
      if (data.length > 0 && !activeId) setActiveId(data[0].id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [activeId])

  useEffect(() => { load() }, [])

  const openModal = (classroomId: string) => {
    setModalClassroomId(classroomId)
    setNewName("")
    setNewPassword("")
    setSaveError(null)
    setCredential(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setCredential(null)
    setNewName("")
    setNewPassword("")
    setSaveError(null)
  }

  const handleAdd = async () => {
    if (!modalClassroomId || !newName.trim()) {
      setSaveError("Ad zorunludur.")
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/teacher/ogrenci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        newName.trim(),
          classroomId: modalClassroomId,
          password:    newPassword.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? "Hata olustu.")
      setCredential({ name: json.name, username: json.username, plainPassword: json.plainPassword })
      load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setSaving(false)
    }
  }

  const copyCredentials = async (cred: NewCredential) => {
    const text = `Ad: ${cred.name}\nKullanici Adi: ${cred.username}\nSifre: ${cred.plainPassword}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const active = classrooms.find((c) => c.id === activeId)

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse bg-brand-light rounded-2xl h-12 w-64" />
        <div className="animate-pulse bg-brand-light rounded-2xl h-64" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>
  }

  if (classrooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-form-border p-16 flex flex-col items-center gap-3">
        <GraduationCap className="w-10 h-10 text-muted/30" />
        <p className="text-muted text-[14px]">Henuz bir sinifa atanmadiniz.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">Sinifim</h1>
          <p className="text-muted text-[14px] mt-0.5">
            {classrooms.length > 1 ? `${classrooms.length} sinif` : classrooms[0].name}
          </p>
        </div>
        {active && (
          <button
            onClick={() => openModal(active.id)}
            className="bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ogrenci Ekle
          </button>
        )}
      </div>

      {classrooms.length > 1 && (
        <div className="flex border-b border-form-border gap-6">
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`pb-3 text-[14px] font-medium transition-colors border-b-2 -mb-px ${
                activeId === c.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"
              }`}
            >
              {c.name}
              <span className="ml-2 bg-brand-light text-brand rounded-full px-2 py-0.5 text-[11px] font-semibold">
                {c.students.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="bg-white rounded-2xl border border-form-border overflow-hidden">
          <div className="px-6 py-4 border-b border-form-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-muted" />
              <span className="text-[14px] font-semibold text-brand">{active.name} — {active.grade}. Sinif</span>
            </div>
            <span className="text-muted text-[13px]">{active.students.length} ogrenci</span>
          </div>

          {active.students.length === 0 ? (
            <div className="p-16 flex flex-col items-center gap-3">
              <Users className="w-10 h-10 text-muted/30" />
              <p className="text-muted text-[14px]">Bu sinifta henuz ogrenci yok.</p>
              <button
                onClick={() => openModal(active.id)}
                className="bg-brand text-white rounded-xl px-4 py-2 text-[13px] font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Ilk Ogrenciyi Ekle
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-surface-section">
                <tr>
                  {["#", "Ad Soyad", "Kullanici Adi", "Durum"].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-left text-[12px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.students.map((s, i) => (
                  <tr key={s.id} className="border-t border-form-border hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-muted text-[13px]">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-brand text-[14px]">{s.user.name}</td>
                    <td className="px-6 py-4 text-muted text-[14px] font-mono">{s.user.username ?? "—"}</td>
                    <td className="px-6 py-4">
                      {s.user.isActive
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
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-semibold text-brand">Ogrenci Ekle</h2>
              <button onClick={closeModal} className="text-muted hover:text-brand transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {credential ? (
              <div className="flex flex-col gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 text-[14px] font-semibold mb-3">Ogrenci basariyla eklendi!</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Ad Soyad", value: credential.name },
                      { label: "Kullanici Adi", value: credential.username },
                      { label: "Sifre", value: credential.plainPassword },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[13px] text-muted">{label}:</span>
                        <span className="text-[13px] font-mono font-semibold text-brand">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted mt-3">Bu bilgileri not alin. Sifre bir daha gosterilmeyecek.</p>
                </div>
                <button
                  onClick={() => copyCredentials(credential)}
                  className="flex items-center justify-center gap-2 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Kopyalandi!" : "Bilgileri Kopyala"}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setCredential(null); setNewName(""); setNewPassword("") }}
                    className="flex-1 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors"
                  >
                    Baska Ogrenci Ekle
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-[13px]">
                    {saveError}
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-medium text-brand mb-1.5">Ad Soyad *</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ali Yilmaz"
                    className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-brand mb-1.5">
                    Sifre
                    <span className="text-muted font-normal ml-1">(bos birakilirsa otomatik uretilir)</span>
                  </label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="1234"
                    maxLength={20}
                    className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={closeModal}
                    className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors"
                  >
                    Iptal
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={saving || !newName.trim()}
                    className="flex-1 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
                  >
                    {saving ? "Ekleniyor..." : "Ekle"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
