"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { getDashboard } from "@/lib/auth"

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const router = useRouter()

  const signIn = async (identifier: string, password: string, rememberMe = false) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message ?? "Giriş başarısız.")
    }

    setUser(data.user, rememberMe)
    router.push(getDashboard(data.user.role))
  }

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    logout()
    router.push("/giris")
  }

  const redirectIfAuthenticated = () => {
    if (isAuthenticated && user) {
      router.replace(getDashboard(user.role))
    }
  }

  return {
    user,
    isAuthenticated,
    role: user?.role,
    signIn,
    signOut,
    redirectIfAuthenticated,
  }
}
