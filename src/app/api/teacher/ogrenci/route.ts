import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"

function toAscii(str: string): string {
  return str
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/\s+/g, "")
}

async function generateUsername(name: string, grade: number, classroom: string): Promise<string> {
  const base     = toAscii(name)
  const suffix   = `_${grade}${classroom.toLowerCase()}`
  const candidate = base + suffix

  const existing = await prisma.user.findUnique({ where: { username: candidate } })
  if (!existing) return candidate

  const random = Math.floor(10 + Math.random() * 90).toString()
  return candidate + random
}

export async function POST(req: NextRequest) {
  const auth = requireAuth()
  if (!auth || auth.role !== "TEACHER")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, classroomId, password } = await req.json()

  if (!name || name.trim().length < 2)
    return NextResponse.json({ message: "Ad en az 2 karakter olmalidir." }, { status: 400 })
  if (!classroomId)
    return NextResponse.json({ message: "Sinif zorunludur." }, { status: 400 })

  // Sınıfın bu öğretmene ait olduğunu doğrula
  const classroom = await prisma.classroom.findFirst({
    where: { id: classroomId, teacherId: auth.id },
    select: { id: true, name: true, grade: true, schoolId: true },
  })
  if (!classroom)
    return NextResponse.json({ message: "Bu sinif size ait degil." }, { status: 403 })

  const plainPassword  = password?.trim() || Math.floor(1000 + Math.random() * 9000).toString()
  const classLetter    = classroom.name.split("-").pop() ?? "a"
  const username       = await generateUsername(name.trim(), classroom.grade, classLetter)
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password:  hashedPassword,
        name:      name.trim(),
        role:      "STUDENT",
        schoolId:  classroom.schoolId,
        student: {
          create: {
            schoolId:    classroom.schoolId,
            classroomId: classroom.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        isActive: true,
        student: { select: { id: true } },
      },
    })

    return NextResponse.json({ ...user, plainPassword }, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return NextResponse.json({ message: "Bu kullanici adi zaten kullaniliyor." }, { status: 400 })
    return NextResponse.json({ message: "Sunucu hatasi." }, { status: 500 })
  }
}
