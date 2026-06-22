"use client"

import { useEffect, useState, useCallback } from "react"
import { MessageSquare, Plus, Edit, Trash2 } from "lucide-react"
import { YorumModal } from "@/components/sistem-yoneticisi/YorumModal"
import type { TestimonialData } from "@/types/admin"
import Image from "next/image"

export default function YorumlarPage() {
  const [items,   setItems]   = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [showModal,    setShowModal]    = useState(false)
  const [editingItem,  setEditingItem]  = useState<TestimonialData | null>(null)
  const [deletingId,   setDeletingId]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/yorumlar")
      if (!res.ok) throw new Error("Veri yuklenemedi.")
      setItems(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata olustu.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd()  { setEditingItem(null); setShowModal(true) }
  function openEdit(item: TestimonialData) { setEditingItem(item); setShowModal(true) }

  async function handleDelete(id: string) {
    if (!confirm("Bu yorum silinecek. Emin misiniz?")) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/yorumlar/${id}`, { method: "DELETE" })
      await load()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand">Kullanıcı Yorumları</h1>
            <p className="text-sm text-muted">Kurumsal sitede gösterilecek yorumları yönetin</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yorum Ekle
        </button>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 mb-4">{error}</p>}

      {loading ? (
        <div className="text-center py-20 text-muted text-sm">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted text-sm">
          Henüz yorum eklenmemiş. İlk yorumu eklemek için butona tıklayın.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${item.isActive ? "border-surface-section" : "border-red-100 opacity-60"}`}>
              <div className="flex items-start gap-3 mb-3">
                {item.photoUrl ? (
                  <Image
                    src={item.photoUrl}
                    alt={item.author}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-surface-section"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0 text-brand font-bold text-lg">
                    {item.author.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-brand text-[14px] leading-tight">{item.author}</div>
                  <div className="text-muted text-[12px]">{item.role}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-surface-section text-muted rounded-full px-2 py-0.5">Sıra: {item.order}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {item.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-section transition-colors text-muted hover:text-brand"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-muted hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-brand/70 leading-relaxed line-clamp-3">&ldquo;{item.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <YorumModal
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load() }}
        />
      )}
    </div>
  )
}
