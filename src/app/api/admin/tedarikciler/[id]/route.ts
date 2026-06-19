import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { users: true, students: true } },
      users: {
        select: { id: true, name: true, email: true, role: true, isActive: true },
      },
      students: {
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true } },
              school: { select: { name: true } },
            },
          },
        },
      },
    },
  })

  if (!supplier) return NextResponse.json({ message: "Tedarikci bulunamadi." }, { status: 404 })

  return NextResponse.json(supplier)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, phone, address, isActive } = await req.json()

  if (name !== undefined && name.trim().length < 2) {
    return NextResponse.json({ message: "Tedarikci adi en az 2 karakter olmalidir." }, { status: 400 })
  }

  const supplier = await prisma.supplier.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone?.trim() || null }),
      ...(address !== undefined && { address: address?.trim() || null }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(supplier)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const userCount = await prisma.user.count({ where: { supplierId: params.id } })
  if (userCount > 0) {
    return NextResponse.json(
      { message: "Bu tedarikciye bagli kullanicilar var." },
      { status: 400 }
    )
  }

  await prisma.supplier.update({ where: { id: params.id }, data: { isActive: false } })

  return NextResponse.json({ message: "Tedarikci pasife alindi." })
}
