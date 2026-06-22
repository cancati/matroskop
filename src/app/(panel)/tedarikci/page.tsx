"use client"

import { Building2 } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"

export default function TedarikciPage() {
  const { user } = useAuthStore()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Hos Geldiniz, {user?.name}</h1>
        <p className="text-muted text-[15px] mt-1">Panel gelistirme asamasindadir.</p>
      </div>
      <div className="bg-white rounded-2xl border border-form-border p-8 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="bg-brand-light rounded-2xl p-4">
          <Building2 className="w-8 h-8 text-brand" />
        </div>
        <p className="text-[15px] font-semibold text-brand">Tedarikci Paneli</p>
        <p className="text-muted text-[14px] text-center max-w-sm">Bu sayfa yakinda eklenecek.</p>
      </div>
    </div>
  )
}
