"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { loginSchema, type LoginInput } from "@/lib/validators"
import { useAuth } from "@/hooks/useAuth"

const TEST_ACCOUNTS = [
  { label: "Sistem Yöneticisi", email: "admin@matroskop.com" },
  { label: "Okul Yöneticisi",   email: "okul@matroskop.com" },
  { label: "Öğretmen",          email: "ogretmen@matroskop.com" },
  { label: "Öğrenci",           email: "ogrenci@matroskop.com" },
  { label: "Tedarikçi",         email: "tedarikci@matroskop.com" },
]

export function LoginForm() {
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn(data.email, data.password, data.rememberMe ?? false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestAccount = (email: string) => {
    setValue("email", email)
    setValue("password", "123456")
  }

  return (
    <div>
      {/* Mobil logo */}
      <div className="flex items-center gap-2 mb-8 md:hidden">
        <span className="text-brand font-black text-xl">Matroskop</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow inline-block" />
      </div>

      <h1 className="text-2xl font-bold text-brand">Hoş Geldiniz</h1>
      <p className="text-muted text-sm mt-1">Hesabınıza giriş yapın</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@mail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-brand">Şifre</label>
            <a
              href="/sifre-sifirla"
              className="text-sm text-brand/60 hover:text-brand transition-colors"
            >
              Şifremi unuttum
            </a>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted hover:text-brand transition-colors"
                tabIndex={-1}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            }
            {...register("password")}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 accent-brand rounded"
            {...register("rememberMe")}
          />
          <label htmlFor="rememberMe" className="text-sm text-brand/70 cursor-pointer">
            Beni hatırla
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          intent="primary"
          loading={isLoading}
          className="w-full py-3.5 rounded-xl text-[15px]"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Sorun mu yaşıyorsunuz?
        <a href="mailto:info@matroskop.com" className="text-brand hover:underline ml-1">
          Destek alın
        </a>
      </p>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 bg-surface-section rounded-xl p-4">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            Test Hesapları
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {TEST_ACCOUNTS.map(({ label, email }) => (
              <button
                key={email}
                type="button"
                onClick={() => fillTestAccount(email)}
                className="text-xs bg-white border border-form-border rounded-lg px-3 py-2 text-brand hover:bg-brand-light text-left transition-colors"
              >
                {label} — {email}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
