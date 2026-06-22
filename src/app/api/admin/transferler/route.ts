import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get("status") ?? "PENDING"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const skip = (page - 1) * limit

  const [transfers, total] = await prisma.$transaction([
    prisma.transfer.findMany({
      where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
      take: limit,
      skip,
      orderBy: { requestedAt: "desc" },
      include: {
        student: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    }),
    prisma.transfer.count({ where: { status: status as "PENDING" | "APPROVED" | "REJECTED" } }),
  ])

  const schoolIds = [
    ...transfers.map((t) => t.fromSchoolId).filter(Boolean) as string[],
    ...transfers.map((t) => t.toSchoolId),
  ]
  const schools = await prisma.school.findMany({
    where: { id: { in: Array.from(new Set(schoolIds)) } },
    select: { id: true, name: true },
  })
  const schoolMap = Object.fromEntries(schools.map((s) => [s.id, s.name]))

  const data = transfers.map((t) => ({
    ...t,
    fromSchoolName: t.fromSchoolId ? (schoolMap[t.fromSchoolId] ?? null) : null,
    toSchoolName: schoolMap[t.toSchoolId] ?? t.toSchoolId,
  }))

  return NextResponse.json({ data, total, page, limit })
}
