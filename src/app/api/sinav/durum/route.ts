import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ hasActive: false })

  const student = await prisma.student.findUnique({ where: { userId: auth.id } })
  if (!student) return NextResponse.json({ hasActive: false })

  const activeExam = await prisma.exam.findFirst({
    where: { studentId: student.id, status: { in: ["PENDING", "IN_PROGRESS"] } },
    include: { _count: { select: { answers: true } } },
  })

  if (!activeExam) return NextResponse.json({ hasActive: false })

  const answeredCount = await prisma.examAnswer.count({
    where: { examId: activeExam.id, selected: { not: -1 } },
  })

  return NextResponse.json({
    hasActive: true,
    answeredCount,
    totalCount: activeExam._count.answers,
  })
}
