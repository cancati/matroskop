import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "TEACHER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: auth.id },
    select: { id: true, name: true, grade: true },
  })

  if (classrooms.length === 0) return NextResponse.json([])

  const classroomIds = classrooms.map((c) => c.id)
  const classroomMap = Object.fromEntries(classrooms.map((c) => [c.id, c]))

  const students = await prisma.student.findMany({
    where: { classroomId: { in: classroomIds } },
    include: {
      user: { select: { name: true, username: true, email: true } },
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
      classroom: s.classroomId ? classroomMap[s.classroomId]?.name ?? null : null,
      grade: s.classroomId ? classroomMap[s.classroomId]?.grade ?? null : null,
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
