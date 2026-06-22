import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"
import bcrypt from "bcryptjs"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      username: true,
      isActive: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          school:    { select: { id: true, name: true } },
          classroom: { select: { id: true, name: true, grade: true } },
          exams: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              status: true,
              createdAt: true,
              grade: true,
              result: { select: { G76: true, level: true } },
            },
          },
        },
      },
    },
  })

  if (!user || !user.student)
    return NextResponse.json({ message: "Ogrenci bulunamadi." }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, isActive, schoolId, resetPassword } = await req.json()

  if (resetPassword) {
    const plain    = Math.floor(1000 + Math.random() * 9000).toString()
    const hashed   = await bcrypt.hash(plain, 10)
    await prisma.user.update({
      where: { id: params.id },
      data:  { password: hashed },
    })
    return NextResponse.json({ newPassword: plain })
  }

  const data: Record<string, unknown> = {}
  if (name      !== undefined) data.name     = name.trim()
  if (isActive  !== undefined) data.isActive = isActive
  if (schoolId  !== undefined) {
    data.schoolId = schoolId || null
    await prisma.student.updateMany({
      where: { userId: params.id },
      data:  { schoolId: schoolId || null },
    })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, username: true, isActive: true },
  })

  return NextResponse.json(user)
}
