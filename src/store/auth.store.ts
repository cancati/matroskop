"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/types/user"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  rememberMe: boolean
  setUser: (user: User, rememberMe?: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false,

      setUser: (user, rememberMe = false) => {
        set({ user, isAuthenticated: true, rememberMe })
        if (rememberMe && typeof window !== "undefined") {
          const state = { state: { user, rememberMe } }
          localStorage.setItem("matroskop-auth", JSON.stringify(state))
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("matroskop-auth")
          sessionStorage.removeItem("matroskop-auth")
        }
        set({ user: null, isAuthenticated: false, rememberMe: false })
      },
    }),
    {
      name: "matroskop-auth",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") return localStorage
        return localStorage.getItem("matroskop-auth") ? localStorage : sessionStorage
      }),
      partialize: (state) => ({
        user: state.user,
        rememberMe: state.rememberMe,
      }),
      skipHydration: true,
    }
  )
)
