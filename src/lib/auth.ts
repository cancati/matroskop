import type { UserRole } from "@/types/user"

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

export async function requestPasswordReset(email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600))
  void email
}
