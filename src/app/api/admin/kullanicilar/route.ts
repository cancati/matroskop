import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  username: true,
  role: true,
  isActive: true,
  createdAt: true,
  school: { select: { id: true, name: true } },
  supplier: { select: { id: true, name: true } },
} as const

export async function GET(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get("search") ?? ""
  const role = searchParams.get("role") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const skip = (page - 1) * limit

  const where: Prisma.UserWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role ? { role: role as Prisma.EnumRoleFilter } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      select: USER_SELECT,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ data, total, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { name, email, password, role, schoolId, supplierId } = await req.json()

  if (!name || name.trim().length < 2)
    return NextResponse.json({ message: "Ad en az 2 karakter olmalidir." }, { status: 400 })
  if (!email || !email.includes("@"))
    return NextResponse.json({ message: "Gecerli bir email girin." }, { status: 400 })
  if (!password || password.length < 6)
    return NextResponse.json({ message: "Sifre en az 6 karakter olmalidir." }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        schoolId: schoolId || null,
        supplierId: supplierId || null,
      },
      select: USER_SELECT,
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ message: "Bu email zaten kullaniliyor." }, { status: 400 })
    }
    return NextResponse.json({ message: "Sunucu hatasi." }, { status: 500 })
  }
}
