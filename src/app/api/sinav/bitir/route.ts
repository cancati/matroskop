import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { examId } = await req.json()

  const student = await prisma.student.findUnique({ where: { userId: auth.id } })
  if (!student) return NextResponse.json({ message: "Ogrenci bulunamadi." }, { status: 404 })

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      answers: {
        include: { question: { select: { category: true } } },
      },
    },
  })

  if (!exam) return NextResponse.json({ message: "Sinav bulunamadi." }, { status: 404 })
  if (exam.studentId !== student.id)
    return NextResponse.json({ message: "Bu sinav size ait degil." }, { status: 403 })
  if (exam.status !== "IN_PROGRESS")
    return NextResponse.json({ message: "Sinav aktif degil." }, { status: 400 })

  const unanswered = exam.answers.filter((a) => a.selected === -1)
  if (unanswered.length > 0)
    return NextResponse.json(
      { message: `${unanswered.length} soru cevaplanmamis.` },
      { status: 400 }
    )

  const g57 = exam.answers.filter((a) => a.question.category === "G57")
  const g58 = exam.answers.filter((a) => a.question.category === "G58")
  const g59 = exam.answers.filter((a) => a.question.category === "G59")

  const G57 = (g57.filter((a) => a.isCorrect).length / 20) * 100
  const G58 = (g58.filter((a) => a.isCorrect).length / 15) * 100
  const G59 = (g59.filter((a) => a.isCorrect).length / 15) * 100
  const G76 = G57 * 0.4 + G58 * 0.3 + G59 * 0.3

  const level =
    G76 < 30 ? "A1" :
    G76 < 45 ? "A2" :
    G76 < 60 ? "B1" :
    G76 < 75 ? "B2" :
    G76 < 90 ? "C1" : "C2"

  await prisma.$transaction([
    prisma.exam.update({
      where: { id: examId },
      data: { status: "COMPLETED", endedAt: new Date() },
    }),
    prisma.examResult.create({
      data: { examId, G57, G58, G59, G76, level },
    }),
  ])

  return NextResponse.json({ G57, G58, G59, G76, level })
}
