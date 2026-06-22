import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

async function getSchoolId(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { schoolId: true } })
  return user?.schoolId ?? null
}

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "SCHOOL_ADMIN")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const schoolId = await getSchoolId(auth.id)
  if (!schoolId) return NextResponse.json({ message: "Okul kaydı bulunamadı." }, { status: 404 })

  const teachers = await prisma.user.findMany({
    where: { schoolId, role: "TEACHER", isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      isActive: true,
      classrooms: { select: { id: true, name: true, grade: true, _count: { select: { students: true } } } },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(teachers)
}
