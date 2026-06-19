import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "SUPPLIER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const authUser = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { supplierId: true },
  })

  if (!authUser?.supplierId)
    return NextResponse.json({ message: "Tedarikci kaydı bulunamadı." }, { status: 404 })

  const rows = await prisma.studentSupplier.findMany({
    where: { supplierId: authUser.supplierId, isActive: true },
    include: {
      student: {
        include: {
          user: { select: { name: true, username: true, email: true } },
          school: { select: { name: true } },
          classroom: { select: { name: true, grade: true } },
          exams: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { result: { select: { G76: true, level: true } } },
          },
        },
      },
    },
    orderBy: { assignedAt: "asc" },
  })

  return NextResponse.json(
    rows.map((ss) => {
      const activeExam = ss.student.exams.find((e) => e.status === "PENDING" || e.status === "IN_PROGRESS")
      const lastCompleted = ss.student.exams.find((e) => e.status === "COMPLETED")
      return {
        id: ss.student.id,
        name: ss.student.user.name,
        username: ss.student.user.username ?? ss.student.user.email ?? "—",
        school: ss.student.school?.name ?? null,
        classroom: ss.student.classroom?.name ?? null,
        grade: ss.student.classroom?.grade ?? null,
        activeExam: activeExam ? (activeExam.status as "PENDING" | "IN_PROGRESS") : null,
        lastExam: lastCompleted
          ? { g76: lastCompleted.result?.G76 ?? null, level: lastCompleted.result?.level ?? null }
          : null,
      }
    })
  )
}
