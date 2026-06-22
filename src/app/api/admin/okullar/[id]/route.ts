import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const school = await prisma.school.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { users: true, students: true, classrooms: true } },
      users: {
        select: { id: true, name: true, email: true, username: true, role: true, isActive: true },
        orderBy: { role: "asc" },
      },
      classrooms: {
        include: {
          teacher: { select: { name: true } },
          _count: { select: { students: true } },
        },
        orderBy: [{ grade: "asc" }, { name: "asc" }],
      },
      students: {
        include: {
          user: { select: { name: true, email: true, username: true } },
          classroom: { select: { name: true } },
          suppliers: {
            where: { isActive: true },
            include: { supplier: { select: { name: true } } },
          },
        },
      },
    },
  })

  if (!school) return NextResponse.json({ message: "Okul bulunamadi." }, { status: 404 })

  return NextResponse.json(school)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, city, phone, isActive } = await req.json()

  if (name !== undefined && name.trim().length < 2) {
    return NextResponse.json({ message: "Okul adi en az 2 karakter olmalidir." }, { status: 400 })
  }

  const school = await prisma.school.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(city !== undefined && { city: city?.trim() || null }),
      ...(phone !== undefined && { phone: phone?.trim() || null }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(school)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const userCount = await prisma.user.count({ where: { schoolId: params.id } })
  if (userCount > 0) {
    return NextResponse.json(
      { message: "Bu okula bagli kullanicilar var. Once kullanicilari kaldirin." },
      { status: 400 }
    )
  }

  await prisma.school.update({ where: { id: params.id }, data: { isActive: false } })

  return NextResponse.json({ message: "Okul pasife alindi." })
}
