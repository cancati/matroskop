import { z } from "zod"

export const loginSchema = z.object({
  identifier: z.string().min(1, "Bu alan zorunludur."),
  password:   z.string().min(1, "Şifre zorunludur."),
  rememberMe: z.boolean().optional(),
})

export const resetSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ResetInput = z.infer<typeof resetSchema>
