import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get("search") ?? ""
  const isActiveParam = searchParams.get("isActive")
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const skip = (page - 1) * limit

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(isActiveParam !== null ? { isActive: isActiveParam === "true" } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.school.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { users: true, students: true, classrooms: true } } },
    }),
    prisma.school.count({ where }),
  ])

  return NextResponse.json({ data, total, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, city, phone } = await req.json()

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ message: "Okul adi en az 2 karakter olmalidir." }, { status: 400 })
  }

  const school = await prisma.school.create({
    data: { name: name.trim(), city: city?.trim() || null, phone: phone?.trim() || null },
  })

  return NextResponse.json(school, { status: 201 })
}
