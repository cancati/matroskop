"use client"

import { useEffect } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { useAuth } from "@/hooks/useAuth"

export default function GirisClient() {
  const { redirectIfAuthenticated } = useAuth()

  useEffect(() => {
    redirectIfAuthenticated()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <LoginForm />
}
