import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  const auth = requireAuth()
  if (!auth || auth.role !== "SUPPLIER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { studentId } = await req.json()
  if (!studentId)
    return NextResponse.json({ message: "Ogrenci secilmedi." }, { status: 400 })

  const authUser = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { supplierId: true },
  })

  if (!authUser?.supplierId)
    return NextResponse.json({ message: "Tedarikci kaydı bulunamadı." }, { status: 404 })

  const membership = await prisma.studentSupplier.findFirst({
    where: { studentId, supplierId: authUser.supplierId, isActive: true },
  })

  if (!membership)
    return NextResponse.json({ message: "Bu ogrenci size atanmamis." }, { status: 403 })

  const existing = await prisma.exam.findFirst({
    where: { studentId, status: { in: ["PENDING", "IN_PROGRESS"] } },
  })

  if (existing)
    return NextResponse.json({ message: "Bu ogrenci icin aktif bir sinav zaten mevcut." }, { status: 409 })

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { classroom: { select: { grade: true } } },
  })

  if (!student)
    return NextResponse.json({ message: "Ogrenci bulunamadı." }, { status: 404 })

  const grade = student.classroom?.grade ?? 3

  const selectedQuestions: { poolNumber: number; questionId: string }[] = []

  for (let poolNumber = 1; poolNumber <= 50; poolNumber++) {
    const pool = await prisma.question.findMany({
      where: { poolNumber, grade, isActive: true },
      select: { id: true },
    })
    if (pool.length === 0) continue
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    selectedQuestions.push({ poolNumber, questionId: chosen.id })
  }

  if (selectedQuestions.length === 0)
    return NextResponse.json(
      { message: "Bu sinif icin aktif soru bulunamadı." },
      { status: 400 }
    )

  const exam = await prisma.exam.create({
    data: { studentId, grade, status: "PENDING" },
  })

  await prisma.$transaction(
    selectedQuestions.map(({ questionId }) =>
      prisma.examAnswer.create({
        data: { examId: exam.id, questionId, selected: -1, isCorrect: false },
      })
    )
  )

  return NextResponse.json({ message: "Sinav basariyla olusturuldu.", examId: exam.id }, { status: 201 })
}
