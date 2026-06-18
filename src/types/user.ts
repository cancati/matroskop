export type UserRole =
  | "SYSTEM_ADMIN"
  | "SUPPLIER"
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId?: string
}

export interface Session {
  user: User
  rememberMe: boolean
}
