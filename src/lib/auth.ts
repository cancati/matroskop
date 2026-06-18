import type { User, UserRole } from "@/types/user"

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "/sistem-yoneticisi",
  SUPPLIER:     "/tedarikci",
  SCHOOL_ADMIN: "/okul-yoneticisi",
  TEACHER:      "/ogretmen",
  STUDENT:      "/ogrenci",
}

export function getDashboard(role: UserRole): string {
  return ROLE_DASHBOARDS[role]
}

const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@matroskop.com": {
    id: "1", email: "admin@matroskop.com",
    name: "Sistem Yöneticisi", role: "SYSTEM_ADMIN",
    password: "123456",
  },
  "okul@matroskop.com": {
    id: "2", email: "okul@matroskop.com",
    name: "Okul Yöneticisi", role: "SCHOOL_ADMIN",
    tenantId: "school-1", password: "123456",
  },
  "ogretmen@matroskop.com": {
    id: "3", email: "ogretmen@matroskop.com",
    name: "Ayşe Öğretmen", role: "TEACHER",
    tenantId: "school-1", password: "123456",
  },
  "ogrenci@matroskop.com": {
    id: "4", email: "ogrenci@matroskop.com",
    name: "Ali Öğrenci", role: "STUDENT",
    tenantId: "school-1", password: "123456",
  },
  "tedarikci@matroskop.com": {
    id: "5", email: "tedarikci@matroskop.com",
    name: "Tedarikçi Sorumlusu", role: "SUPPLIER",
    tenantId: "supplier-1", password: "123456",
  },
}

export async function login(email: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 800))

  const mockUser = MOCK_USERS[email.toLowerCase()]
  if (!mockUser || mockUser.password !== password) {
    throw new Error("E-posta veya şifre hatalı.")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...user } = mockUser
  return user
}

export async function requestPasswordReset(email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600))
  void email
}
