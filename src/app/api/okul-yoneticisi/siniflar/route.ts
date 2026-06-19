import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "SCHOOL_ADMIN")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const authUser = await prisma.user.findUnique({ where: { id: auth.id }, select: { schoolId: true } })
  if (!authUser?.schoolId) return NextResponse.json({ message: "Okul kaydı bulunamadı." }, { status: 404 })

  const classrooms = await prisma.classroom.findMany({
    where: { schoolId: authUser.schoolId },
    include: {
      teacher: { select: { name: true } },
      _count: { select: { students: true } },
    },
    orderBy: [{ grade: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(classrooms)
}
