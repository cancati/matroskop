"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { Input } from "@/components/ui/Input"
import type { UserWithRelations } from "@/types/admin"

const schema = z.object({
  name:        z.string().min(2, "Ad en az 2 karakter olmalidir"),
  email:       z.string().email("Gecerli bir email girin"),
  password:    z.string().min(6, "Sifre en az 6 karakter olmalidir").optional(),
  role:        z.enum(["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "SUPPLIER"]),
  schoolId:    z.string().optional(),
  supplierId:  z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface KullaniciModalProps {
  isOpen: boolean
  onClose: () => void
  kullanici?: UserWithRelations | null
  onSuccess: () => void
}

const ROLE_LABELS: Record<string, string> = {
  SYSTEM_ADMIN: "Sistem Yoneticisi",
  SCHOOL_ADMIN: "Okul Yoneticisi",
  TEACHER:      "Ogretmen",
  STUDENT:      "Ogrenci",
  SUPPLIER:     "Tedarikci",
}

export function KullaniciModal({ isOpen, onClose, kullanici, onSuccess }: KullaniciModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([])

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT" },
  })

  const role = watch("role")
  const showSchool = role === "SCHOOL_ADMIN" || role === "TEACHER"
  const showSupplier = role === "SUPPLIER"

  useEffect(() => {
    if (!isOpen) return
    reset({
      name: kullanici?.name ?? "",
      email: kullanici?.email ?? "",
      role: kullanici?.role ?? "STUDENT",
      schoolId: kullanici?.school?.id ?? "",
      supplierId: kullanici?.supplier?.id ?? "",
    })
    setError(null)

    async function fetchRelations() {
      const [sr, tr] = await Promise.all([
        fetch("/api/admin/okullar?limit=100").then((r) => r.json()),
        fetch("/api/admin/tedarikciler?limit=100").then((r) => r.json()),
      ])
      setSchools(sr.data ?? [])
      setSuppliers(tr.data ?? [])
    }
    fetchRelations()
  }, [isOpen, kullanici, reset])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    const body = {
      ...data,
      ...(kullanici && { password: undefined }),
      schoolId: showSchool ? data.schoolId || null : null,
      supplierId: showSupplier ? data.supplierId || null : null,
    }
    try {
      const res = await fetch(
        kullanici ? `/api/admin/kullanicilar/${kullanici.id}` : "/api/admin/kullanicilar",
        { method: kullanici ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
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
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-semibold text-brand">
            {kullanici ? "Kullanici Duzenle" : "Yeni Kullanici Ekle"}
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
          <Input label="Ad Soyad *" error={errors.name?.message} {...register("name")} />
          <Input label="Email *" type="email" error={errors.email?.message} {...register("email")} />

          {!kullanici && (
            <Input label="Sifre *" type="password" error={errors.password?.message} {...register("password")} />
          )}

          <div className="w-full">
            <label className="block text-sm font-medium text-brand mb-1.5">Rol *</label>
            <select
              {...register("role")}
              className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[15px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            >
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {showSchool && (
            <div className="w-full">
              <label className="block text-sm font-medium text-brand mb-1.5">Okul</label>
              <select
                {...register("schoolId")}
                className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[15px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="">Secin...</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {showSupplier && (
            <div className="w-full">
              <label className="block text-sm font-medium text-brand mb-1.5">Tedarikci</label>
              <select
                {...register("supplierId")}
                className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[15px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="">Secin...</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors">
              Iptal
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60">
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
