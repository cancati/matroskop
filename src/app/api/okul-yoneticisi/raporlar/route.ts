import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "SCHOOL_ADMIN")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const authUser = await prisma.user.findUnique({ where: { id: auth.id }, select: { schoolId: true } })
  if (!authUser?.schoolId) return NextResponse.json({ message: "Okul kaydı bulunamadı." }, { status: 404 })

  const students = await prisma.student.findMany({
    where: { schoolId: authUser.schoolId },
    include: {
      user: { select: { name: true, username: true, email: true } },
      classroom: { select: { name: true, grade: true } },
      exams: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        include: { result: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(
    students.map((s) => ({
      id: s.id,
      name: s.user.name,
      username: s.user.username ?? s.user.email ?? "—",
      classroom: s.classroom?.name ?? null,
      grade: s.classroom?.grade ?? null,
      exams: s.exams.map((e) => ({
        id: e.id,
        grade: e.grade,
        endedAt: e.endedAt,
        createdAt: e.createdAt,
        result: e.result
          ? { G57: e.result.G57, G58: e.result.G58, G59: e.result.G59, G76: e.result.G76, level: e.result.level }
          : null,
      })),
    }))
  )
}
