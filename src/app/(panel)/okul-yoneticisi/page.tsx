"use client"

import { Building2 } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"

export default function OkulYoneticisiDashboard() {
  const { user } = useAuthStore()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-lg mx-auto bg-white rounded-2xl p-10 shadow-sm text-center mt-20">
        <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-brand">Okul Yöneticisi Paneli</h1>
        <p className="text-muted mt-2">Hoş geldiniz, {user?.name}</p>
        <p className="text-xs text-muted/60 mt-1">Bu panel geliştirme aşamasındadır.</p>
        <Button intent="outline" className="mt-6" onClick={signOut}>Çıkış Yap</Button>
      </div>
    </div>
  )
}
