import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "TEACHER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: auth.id },
    select: {
      id: true,
      name: true,
      students: { select: { id: true } },
    },
  })

  const classroomIds = classrooms.map((c) => c.id)
  const classroomMap = Object.fromEntries(classrooms.map((c) => [c.id, c.name]))
  const studentIds = classrooms.flatMap((c) => c.students.map((s) => s.id))
  const totalStudents = studentIds.length

  const allExams = await prisma.exam.findMany({
    where: { studentId: { in: studentIds } },
    select: { id: true, status: true },
  })

  const completedExamIds = allExams.filter((e) => e.status === "COMPLETED").map((e) => e.id)
  const pendingCount = allExams.filter((e) => e.status === "PENDING" || e.status === "IN_PROGRESS").length

  const results = await prisma.examResult.findMany({
    where: { examId: { in: completedExamIds } },
    select: { level: true },
  })

  const levelDistribution: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }
  for (const r of results) {
    if (r.level in levelDistribution) levelDistribution[r.level]++
  }

  const recentExams = await prisma.exam.findMany({
    where: { studentId: { in: studentIds }, status: "COMPLETED" },
    orderBy: { endedAt: "desc" },
    take: 5,
    include: {
      student: {
        select: {
          user: { select: { name: true } },
          classroomId: true,
        },
      },
      result: { select: { G76: true, level: true } },
    },
  })

  return NextResponse.json({
    totalClassrooms: classrooms.length,
    totalStudents,
    examStats: {
      completed: completedExamIds.length,
      pending: pendingCount,
    },
    levelDistribution,
    recentExams: recentExams.map((e) => ({
      id: e.id,
      studentName: e.student.user.name,
      classroom: e.student.classroomId ? (classroomMap[e.student.classroomId] ?? "—") : "—",
      g76: e.result?.G76 ?? null,
      level: e.result?.level ?? null,
      endedAt: e.endedAt,
    })),
  })
}
