import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"
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
  const base = toAscii(name)
  const suffix = `_${grade}${classroom.toLowerCase()}`
  const candidate = base + suffix

  const existing = await prisma.user.findUnique({ where: { username: candidate } })
  if (!existing) return candidate

  const random = Math.floor(10 + Math.random() * 90).toString()
  return candidate + random
}

export async function GET(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search   = searchParams.get("search") ?? ""
  const schoolId = searchParams.get("schoolId") ?? ""
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit    = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const skip     = (page - 1) * limit

  const where: Prisma.UserWhereInput = {
    role: "STUDENT",
    ...(schoolId ? { schoolId } : {}),
    ...(search
      ? {
          OR: [
            { name:     { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
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
            classroom: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ data, total, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, grade, classroom, schoolId, supplierId, password } = await req.json()

  if (!name || name.trim().length < 2)
    return NextResponse.json({ message: "Ad en az 2 karakter olmalidir." }, { status: 400 })
  if (!grade || grade < 1 || grade > 8)
    return NextResponse.json({ message: "Sinif 1-8 arasinda olmalidir." }, { status: 400 })
  if (!classroom || classroom.trim().length === 0)
    return NextResponse.json({ message: "Sinif harfi zorunludur." }, { status: 400 })

  const plainPassword = password?.trim() || Math.floor(1000 + Math.random() * 9000).toString()
  const username      = await generateUsername(name.trim(), grade, classroom.trim())
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name:     name.trim(),
        role:     "STUDENT",
        schoolId: schoolId || null,
        supplierId: supplierId || null,
        student: {
          create: {
            schoolId: schoolId || null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        isActive: true,
        createdAt: true,
        student: { select: { id: true } },
      },
    })

    return NextResponse.json({ ...user, plainPassword }, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ message: "Bu kullanici adi zaten kullaniliyor." }, { status: 400 })
    }
    return NextResponse.json({ message: "Sunucu hatasi." }, { status: 500 })
  }
}
