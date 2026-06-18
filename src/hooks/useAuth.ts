"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { login, getDashboard } from "@/lib/auth"

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const router = useRouter()

  const signIn = async (email: string, password: string, rememberMe = false) => {
    const loggedInUser = await login(email, password)
    setUser(loggedInUser, rememberMe)
    router.push(getDashboard(loggedInUser.role))
  }

  const signOut = () => {
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
