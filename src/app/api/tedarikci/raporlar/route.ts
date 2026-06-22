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
          exams: {
            where: { status: "COMPLETED" },
            orderBy: { createdAt: "desc" },
            include: { result: true },
          },
        },
      },
    },
    orderBy: { assignedAt: "asc" },
  })

  return NextResponse.json(
    rows.map((ss) => ({
      id: ss.student.id,
      name: ss.student.user.name,
      username: ss.student.user.username ?? ss.student.user.email ?? "—",
      exams: ss.student.exams.map((e) => ({
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
