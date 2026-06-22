"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { Input } from "@/components/ui/Input"
import type { SchoolWithCount } from "@/types/admin"

const schema = z.object({
  name:  z.string().min(2, "Okul adi en az 2 karakter olmalidir"),
  city:  z.string().optional(),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface OkulModalProps {
  isOpen: boolean
  onClose: () => void
  okul?: SchoolWithCount | null
  onSuccess: () => void
}

export function OkulModal({ isOpen, onClose, okul, onSuccess }: OkulModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ name: okul?.name ?? "", city: okul?.city ?? "", phone: okul?.phone ?? "" })
      setError(null)
    }
  }, [isOpen, okul, reset])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(
        okul ? `/api/admin/okullar/${okul.id}` : "/api/admin/okullar",
        {
          method: okul ? "PUT" : "POST",
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
            {okul ? "Okul Duzenle" : "Yeni Okul Ekle"}
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
          <Input label="Okul Adi *" error={errors.name?.message} {...register("name")} />
          <Input label="Sehir" placeholder="Isteğe bagli" error={errors.city?.message} {...register("city")} />
          <Input label="Telefon" placeholder="Isteğe bagli" error={errors.phone?.message} {...register("phone")} />

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
