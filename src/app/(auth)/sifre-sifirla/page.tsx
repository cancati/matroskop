"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { ResetForm } from "@/components/auth/ResetForm"
import { Button } from "@/components/ui/Button"

export default function SifreSifirlaPage() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="text-center">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-brand mt-4">E-posta Gönderildi!</h2>
        <p className="text-muted text-sm text-center mt-2">
          E-posta adresinize sıfırlama bağlantısı gönderdik.
          Gelen kutunuzu kontrol edin.
        </p>
        <Button
          intent="outline"
          className="mt-6 w-full"
          onClick={() => (window.location.href = "/giris")}
        >
          Giriş sayfasına dön
        </Button>
      </div>
    )
  }

  return <ResetForm onSent={() => setSent(true)} />
}
