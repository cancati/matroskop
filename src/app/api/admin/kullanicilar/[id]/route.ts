import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"
import { Prisma } from "@prisma/client"

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  school: { select: { id: true, name: true } },
  supplier: { select: { id: true, name: true } },
} as const

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: USER_SELECT,
  })

  if (!user) return NextResponse.json({ message: "Kullanici bulunamadi." }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, email, role, isActive, schoolId, supplierId } = await req.json()

  if (name !== undefined && name.trim().length < 2)
    return NextResponse.json({ message: "Ad en az 2 karakter olmalidir." }, { status: 400 })

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email.toLowerCase().trim() }),
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(schoolId !== undefined && { schoolId: schoolId || null }),
        ...(supplierId !== undefined && { supplierId: supplierId || null }),
      },
      select: USER_SELECT,
    })
    return NextResponse.json(user)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ message: "Bu email zaten kullaniliyor." }, { status: 400 })
    }
    return NextResponse.json({ message: "Sunucu hatasi." }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  await prisma.user.update({ where: { id: params.id }, data: { isActive: false } })

  return NextResponse.json({ message: "Kullanici pasife alindi." })
}
