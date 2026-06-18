"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { resetSchema, type ResetInput } from "@/lib/validators"
import { requestPasswordReset } from "@/lib/auth"

interface ResetFormProps {
  onSent: () => void
}

export function ResetForm({ onSent }: ResetFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetInput) => {
    setIsLoading(true)
    try {
      await requestPasswordReset(data.email)
      onSent()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand">Şifrenizi sıfırlayın</h1>
      <p className="text-muted text-sm mt-1 mb-8">
        E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@mail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          intent="primary"
          loading={isLoading}
          className="w-full py-3.5 rounded-xl text-[15px]"
        >
          {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </Button>
      </form>

      <a
        href="/giris"
        className="mt-4 flex items-center gap-1 text-sm text-brand/60 hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Giriş sayfasına dön
      </a>
    </div>
  )
}
