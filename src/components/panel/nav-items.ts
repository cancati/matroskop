import type { UserRole } from "@/types/user"
import {
  LayoutDashboard, School, Building2, Users,
  BookOpen, ClipboardList, ArrowLeftRight,
  FileText, GraduationCap, BookCheck,
  UserCircle, BarChart2, MessageSquare,
} from "lucide-react"
import type { ElementType } from "react"

export interface NavItem {
  label: string
  href:  string
  icon:  ElementType
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Sistem Yoneticisi",
  SCHOOL_ADMIN: "Okul Yoneticisi",
  TEACHER:      "Ogretmen",
  STUDENT:      "Ogrenci",
  SUPPLIER:     "Tedarikci",
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {

  SYSTEM_ADMIN: [
    { label: "Dashboard",        href: "/sistem-yoneticisi",                  icon: LayoutDashboard },
    { label: "Okullar",          href: "/sistem-yoneticisi/okullar",          icon: School },
    { label: "Tedarikciler",     href: "/sistem-yoneticisi/tedarikciler",     icon: Building2 },
    { label: "Kullanicilar",     href: "/sistem-yoneticisi/kullanicilar",     icon: Users },
    { label: "Soru Bankasi",     href: "/sistem-yoneticisi/soru-bankasi",     icon: BookOpen },
    { label: "Sinav Sablonlari", href: "/sistem-yoneticisi/sinav-sablonlari", icon: ClipboardList },
    { label: "Transferler",      href: "/sistem-yoneticisi/transferler",      icon: ArrowLeftRight },
    { label: "Raporlar",         href: "/sistem-yoneticisi/raporlar",         icon: FileText },
    { label: "Yorumlar",         href: "/sistem-yoneticisi/yorumlar",         icon: MessageSquare },
  ],

  SCHOOL_ADMIN: [
    { label: "Dashboard",        href: "/okul-yoneticisi",                    icon: LayoutDashboard },
    { label: "Ogretmenler",      href: "/okul-yoneticisi/ogretmenler",        icon: Users },
    { label: "Siniflar",         href: "/okul-yoneticisi/siniflar",           icon: GraduationCap },
    { label: "Ogrenciler",       href: "/okul-yoneticisi/ogrenciler",         icon: UserCircle },
    { label: "Sinav Baslat",     href: "/okul-yoneticisi/sinav-baslat",       icon: BookCheck },
    { label: "Transfer Talebi",  href: "/okul-yoneticisi/transfer",           icon: ArrowLeftRight },
    { label: "Raporlar",         href: "/okul-yoneticisi/raporlar",           icon: FileText },
  ],

  TEACHER: [
    { label: "Dashboard",        href: "/ogretmen",                           icon: LayoutDashboard },
    { label: "Sinifim",          href: "/ogretmen/sinifim",                   icon: GraduationCap },
    { label: "Raporlar",         href: "/ogretmen/raporlar",                  icon: BarChart2 },
  ],

  STUDENT: [
    { label: "Dashboard",        href: "/ogrenci",                            icon: LayoutDashboard },
    { label: "Sinava Gir",       href: "/ogrenci/sinav",                      icon: BookCheck },
    { label: "Raporlarim",       href: "/ogrenci/raporlarim",                 icon: FileText },
  ],

  SUPPLIER: [
    { label: "Dashboard",        href: "/tedarikci",                          icon: LayoutDashboard },
    { label: "Ogrenciler",       href: "/tedarikci/ogrenciler",               icon: UserCircle },
    { label: "Sinav Baslat",     href: "/tedarikci/sinav-baslat",             icon: BookCheck },
    { label: "Raporlar",         href: "/tedarikci/raporlar",                 icon: FileText },
  ],
}
