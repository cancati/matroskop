import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function POST() {
  const auth = requireAuth()
  if (!auth || auth.role !== "STUDENT")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const student = await prisma.student.findUnique({
    where: { userId: auth.id },
    include: { classroom: { select: { grade: true } } },
  })

  if (!student)
    return NextResponse.json({ message: "Ogrenci kaydi bulunamadi." }, { status: 404 })

  const grade = student.classroom?.grade ?? 3

  const existingExam = await prisma.exam.findFirst({
    where: { studentId: student.id, status: { in: ["PENDING", "IN_PROGRESS"] } },
    include: {
      answers: {
        include: { question: { select: { content: true, options: true, poolId: true } } },
      },
    },
  })

  if (existingExam) {
    const sorted = existingExam.answers.sort(
      (a, b) => a.question.poolId - b.question.poolId
    )
    return NextResponse.json({
      examId: existingExam.id,
      questions: sorted.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        poolId: a.question.poolId,
        content: a.question.content,
        options: a.question.options,
        selected: a.selected,
      })),
    })
  }

  const selectedQuestions: { poolId: number; questionId: string }[] = []

  for (let poolId = 1; poolId <= 50; poolId++) {
    const pool = await prisma.question.findMany({
      where: { poolId, grade, isActive: true },
      select: { id: true },
    })
    if (pool.length === 0) continue
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    selectedQuestions.push({ poolId, questionId: chosen.id })
  }

  if (selectedQuestions.length === 0)
    return NextResponse.json(
      { message: "Bu sinif icin aktif soru bulunamadi." },
      { status: 400 }
    )

  const exam = await prisma.exam.create({
    data: { studentId: student.id, grade, status: "IN_PROGRESS", startedAt: new Date() },
  })

  await prisma.$transaction(
    selectedQuestions.map(({ questionId }) =>
      prisma.examAnswer.create({
        data: { examId: exam.id, questionId, selected: -1, isCorrect: false },
      })
    )
  )

  const answers = await prisma.examAnswer.findMany({
    where: { examId: exam.id },
    include: { question: { select: { content: true, options: true, poolId: true } } },
  })

  const sorted = answers.sort((a, b) => a.question.poolId - b.question.poolId)

  return NextResponse.json(
    {
      examId: exam.id,
      questions: sorted.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        poolId: a.question.poolId,
        content: a.question.content,
        options: a.question.options,
        selected: a.selected,
      })),
    },
    { status: 201 }
  )
}
