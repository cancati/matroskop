import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { examAnswerId, selected } = await req.json()

  const student = await prisma.student.findUnique({ where: { userId: auth.id } })
  if (!student) return NextResponse.json({ message: "Ogrenci bulunamadi." }, { status: 404 })

  const examAnswer = await prisma.examAnswer.findUnique({
    where: { id: examAnswerId },
    include: {
      exam: { select: { studentId: true, status: true } },
      question: { select: { correctAnswer: true, options: true } },
    },
  })

  if (!examAnswer)
    return NextResponse.json({ message: "Cevap bulunamadi." }, { status: 404 })
  if (examAnswer.exam.studentId !== student.id)
    return NextResponse.json({ message: "Bu cevap size ait degil." }, { status: 403 })
  if (examAnswer.exam.status !== "IN_PROGRESS")
    return NextResponse.json({ message: "Sinav aktif degil." }, { status: 400 })
  if (
    typeof selected !== "number" ||
    selected < 0 ||
    selected >= examAnswer.question.options.length
  )
    return NextResponse.json({ message: "Gecersiz cevap." }, { status: 400 })

  const isCorrect = selected === examAnswer.question.correctAnswer

  await prisma.examAnswer.update({
    where: { id: examAnswerId },
    data: { selected, isCorrect },
  })

  return NextResponse.json({ isCorrect })
}
