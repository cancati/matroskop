import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ hasActive: false })

  const student = await prisma.student.findUnique({
    where: { userId: auth.id },
    include: { classroom: { select: { grade: true } } },
  })
  if (!student) return NextResponse.json({ hasActive: false })

  const grade = student.classroom?.grade ?? 3

  const [activeExam, pools] = await Promise.all([
    prisma.exam.findFirst({
      where: { studentId: student.id, status: { in: ["PENDING", "IN_PROGRESS"] } },
      include: { _count: { select: { answers: true } } },
    }),
    prisma.question.findMany({
      where: { grade, isActive: true },
      select: { poolNumber: true },
      distinct: ["poolNumber"],
    }),
  ])

  const g57 = pools.filter((p) => p.poolNumber <= 20).length
  const g58 = pools.filter((p) => p.poolNumber >= 21 && p.poolNumber <= 35).length
  const g59 = pools.filter((p) => p.poolNumber >= 36).length

  const examInfo = {
    totalPools: pools.length,
    g57,
    g58,
    g59,
  }

  if (!activeExam) return NextResponse.json({ hasActive: false, ...examInfo })

  const answeredCount = await prisma.examAnswer.count({
    where: { examId: activeExam.id, selected: { not: -1 } },
  })

  return NextResponse.json({
    hasActive: true,
    answeredCount,
    totalCount: activeExam._count.answers,
    ...examInfo,
  })
}
