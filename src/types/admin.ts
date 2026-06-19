import type { UserRole } from "@/types/user"

export interface AdminStats {
  okulSayisi: number
  ogrenciSayisi: number
  tedarikciSayisi: number
  sinavSayisi: number
  bekleyenTransfer: number
  aktifKullanici: number
}

export interface SchoolWithCount {
  id: string
  name: string
  city: string | null
  phone: string | null
  isActive: boolean
  createdAt: string
  _count: { users: number; students: number; classrooms: number }
}

export interface SchoolDetail extends SchoolWithCount {
  users: { id: string; name: string; email: string | null; username: string | null; role: string; isActive: boolean }[]
  classrooms: {
    id: string
    name: string
    grade: number
    teacher: { name: string }
    _count: { students: number }
  }[]
  students: {
    id: string
    user: { name: string; email: string | null; username: string | null }
    classroom: { name: string } | null
    suppliers: { isActive: boolean; supplier: { name: string } }[]
  }[]
}

export interface SupplierWithCount {
  id: string
  name: string
  phone: string | null
  address: string | null
  isActive: boolean
  createdAt: string
  _count: { users: number; students: number }
}

export interface SupplierDetail extends SupplierWithCount {
  users: { id: string; name: string; email: string | null; username: string | null; role: string; isActive: boolean }[]
  students: {
    id: string
    isActive: boolean
    student: {
      user: { name: string; email: string | null; username: string | null }
      school: { name: string } | null
    }
  }[]
}

export interface UserWithRelations {
  id: string
  name: string
  email: string | null
  username: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
  school: { id: string; name: string } | null
  supplier: { id: string; name: string } | null
}

export interface QuestionData {
  id:            string
  content:       string
  options:       string[]
  correctAnswer: number
  poolId:        number
  grade:         number
  category:      string
  isActive:      boolean
  createdAt:     string
}

export interface TransferWithRelations {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  note: string | null
  requestedAt: string
  resolvedAt: string | null
  studentId: string
  fromSchoolId: string | null
  toSchoolId: string
  student: { user: { name: string; email: string } }
  fromSchoolName: string | null
  toSchoolName: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
