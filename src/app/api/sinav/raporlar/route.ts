import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const student = await prisma.student.findUnique({ where: { userId: auth.id } })
  if (!student) return NextResponse.json({ message: "Ogrenci bulunamadi." }, { status: 404 })

  const exams = await prisma.exam.findMany({
    where: { studentId: student.id, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: {
      result: true,
      answers: { include: { question: { select: { category: true } } } },
    },
  })

  const stat = (answers: { isCorrect: boolean; selected: number; question: { category: string } }[], cat: string) => {
    const c = answers.filter((a) => a.question.category === cat)
    return {
      correct: c.filter((a) => a.isCorrect).length,
      wrong:   c.filter((a) => !a.isCorrect && a.selected !== -1).length,
      blank:   c.filter((a) => a.selected === -1).length,
    }
  }

  return NextResponse.json(
    exams.map((exam) => ({
      id:        exam.id,
      grade:     exam.grade,
      createdAt: exam.createdAt,
      endedAt:   exam.endedAt,
      result:    exam.result,
      stats: {
        G57: stat(exam.answers, "G57"),
        G58: stat(exam.answers, "G58"),
        G59: stat(exam.answers, "G59"),
      },
    }))
  )
}
