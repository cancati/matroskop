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
      user: { select: { name: true, username: true, email: true, isActive: true } },
      classroom: { select: { name: true, grade: true } },
      exams: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { result: { select: { G76: true, level: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(
    students.map((s) => {
      const activeExam = s.exams.find((e) => e.status === "PENDING" || e.status === "IN_PROGRESS")
      const lastCompleted = s.exams.find((e) => e.status === "COMPLETED")
      return {
        id: s.id,
        name: s.user.name,
        username: s.user.username ?? s.user.email ?? "—",
        isActive: s.user.isActive,
        classroom: s.classroom?.name ?? null,
        grade: s.classroom?.grade ?? null,
        activeExam: activeExam ? (activeExam.status as "PENDING" | "IN_PROGRESS") : null,
        lastExam: lastCompleted
          ? { g76: lastCompleted.result?.G76 ?? null, level: lastCompleted.result?.level ?? null }
          : null,
      }
    })
  )
}
