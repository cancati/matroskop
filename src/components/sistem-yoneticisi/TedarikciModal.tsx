"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { Input } from "@/components/ui/Input"
import type { SupplierWithCount } from "@/types/admin"

const schema = z.object({
  name:    z.string().min(2, "Tedarikci adi en az 2 karakter olmalidir"),
  phone:   z.string().optional(),
  address: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TedarikciModalProps {
  isOpen: boolean
  onClose: () => void
  tedarikci?: SupplierWithCount | null
  onSuccess: () => void
}

export function TedarikciModal({ isOpen, onClose, tedarikci, onSuccess }: TedarikciModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ name: tedarikci?.name ?? "", phone: tedarikci?.phone ?? "", address: tedarikci?.address ?? "" })
      setError(null)
    }
  }, [isOpen, tedarikci, reset])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(
        tedarikci ? `/api/admin/tedarikciler/${tedarikci.id}` : "/api/admin/tedarikciler",
        {
          method: tedarikci ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? "Bir hata olustu.")
      onSuccess()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata olustu.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-semibold text-brand">
            {tedarikci ? "Tedarikci Duzenle" : "Yeni Tedarikci Ekle"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-brand transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-[13px] mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Tedarikci Adi *" error={errors.name?.message} {...register("name")} />
          <Input label="Telefon" placeholder="Isteğe bagli" error={errors.phone?.message} {...register("phone")} />
          <div className="w-full">
            <label className="block text-sm font-medium text-brand mb-1.5">Adres</label>
            <textarea
              {...register("address")}
              rows={2}
              placeholder="Isteğe bagli"
              className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[15px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors"
            >
              Iptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
