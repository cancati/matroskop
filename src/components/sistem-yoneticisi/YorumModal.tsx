"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { TestimonialData } from "@/types/admin"

interface Props {
  item: TestimonialData | null
  onClose: () => void
  onSaved: () => void
}

export function YorumModal({ item, onClose, onSaved }: Props) {
  const [quote,    setQuote]    = useState("")
  const [author,   setAuthor]   = useState("")
  const [role,     setRole]     = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [order,    setOrder]    = useState(0)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (item) {
      setQuote(item.quote)
      setAuthor(item.author)
      setRole(item.role)
      setPhotoUrl(item.photoUrl ?? "")
      setIsActive(item.isActive)
      setOrder(item.order)
    } else {
      setQuote(""); setAuthor(""); setRole(""); setPhotoUrl(""); setIsActive(true); setOrder(0)
    }
    setError(null)
  }, [item])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const url    = item ? `/api/admin/yorumlar/${item.id}` : "/api/admin/yorumlar"
      const method = item ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote, author, role, photoUrl: photoUrl || null, isActive, order }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message ?? "Hata olustu.")
      }
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-section">
          <h2 className="font-bold text-brand text-lg">{item ? "Yorumu Düzenle" : "Yeni Yorum Ekle"}</h2>
          <button onClick={onClose} className="text-muted hover:text-brand transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          <div>
            <label className="block text-[13px] font-semibold text-brand mb-1">Yorum Metni *</label>
            <textarea
              rows={4}
              value={quote}
              onChange={e => setQuote(e.target.value)}
              className="w-full border border-surface-section rounded-xl px-4 py-2.5 text-sm text-brand focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
              placeholder="Kişinin söylediği yorum..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-brand mb-1">Ad Soyad *</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full border border-surface-section rounded-xl px-4 py-2.5 text-sm text-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Ahmet Yılmaz"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-brand mb-1">Ünvan *</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border border-surface-section rounded-xl px-4 py-2.5 text-sm text-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Okul Müdürü"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand mb-1">Fotoğraf URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full border border-surface-section rounded-xl px-4 py-2.5 text-sm text-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="https://..."
            />
            {photoUrl && (
              <img src={photoUrl} alt="Önizleme" className="w-12 h-12 rounded-full object-cover mt-2 border-2 border-surface-section" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-brand mb-1">Sıra</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
                className="w-full border border-surface-section rounded-xl px-4 py-2.5 text-sm text-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                min={0}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-brand"
                />
                <span className="text-[13px] font-semibold text-brand">Aktif (sitede görünsün)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-surface-section text-brand rounded-xl py-2.5 text-sm font-semibold hover:bg-surface-section transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : item ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
