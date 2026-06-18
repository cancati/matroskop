import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  rememberMe: z.boolean().optional(),
})

export const resetSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ResetInput = z.infer<typeof resetSchema>
