export type UserRole =
  | "SYSTEM_ADMIN"
  | "SUPPLIER"
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT"

export interface User {
  id:          string
  email?:      string
  username?:   string
  name:        string
  role:        UserRole
  isActive:    boolean
  schoolId?:   string
  supplierId?: string
}

export type LoginIdentifier = string

export interface Session {
  user: User
  rememberMe: boolean
}
