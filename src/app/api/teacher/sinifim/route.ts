import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "TEACHER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: auth.id },
    orderBy: { grade: "asc" },
    select: {
      id: true,
      name: true,
      grade: true,
      students: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          createdAt: true,
          user: { select: { id: true, name: true, username: true, isActive: true } },
        },
      },
    },
  })

  return NextResponse.json(classrooms)
}
