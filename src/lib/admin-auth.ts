import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export function requireAuth(): { id: string; role: string } | null {
  const token = cookies().get("token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }
  } catch {
    return null
  }
}

export function requireAdmin(): { id: string; role: string } | null {
  const auth = requireAuth()
  if (!auth || auth.role !== "SYSTEM_ADMIN") return null
  return auth
}
