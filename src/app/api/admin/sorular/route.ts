import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search    = searchParams.get("search") ?? ""
  const gradeParam = searchParams.get("grade")
  const category  = searchParams.get("category") ?? ""
  const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const skip  = (page - 1) * limit

  const where = {
    ...(search   ? { content: { contains: search, mode: "insensitive" as const } } : {}),
    ...(gradeParam ? { grade: parseInt(gradeParam) } : {}),
    ...(category ? { category } : {}),
  }

  const [data, total] = await prisma.$transaction([
    prisma.question.findMany({ where, take: limit, skip, orderBy: { poolId: "asc" } }),
    prisma.question.count({ where }),
  ])

  return NextResponse.json({ data, total, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { content, options, correctAnswer, poolId, grade, category } = await req.json()

  if (!content || content.trim().length < 5)
    return NextResponse.json({ message: "Soru metni en az 5 karakter olmalidir." }, { status: 400 })
  if (!Array.isArray(options) || options.length < 4 || options.length > 6)
    return NextResponse.json({ message: "4-6 arasi sik girilmelidir." }, { status: 400 })
  if (typeof correctAnswer !== "number" || correctAnswer < 0 || correctAnswer >= options.length)
    return NextResponse.json({ message: "Dogru sik gecersiz." }, { status: 400 })
  if (!poolId || poolId < 1 || poolId > 50)
    return NextResponse.json({ message: "Havuz ID 1-50 arasinda olmalidir." }, { status: 400 })
  if (!grade || grade < 1 || grade > 8)
    return NextResponse.json({ message: "Sinif 1-8 arasinda olmalidir." }, { status: 400 })
  if (!["G57","G58","G59"].includes(category))
    return NextResponse.json({ message: "Kategori G57, G58 veya G59 olmalidir." }, { status: 400 })

  const question = await prisma.question.create({
    data: {
      content: content.trim(),
      options: options.map((o: string) => o.trim()),
      correctAnswer,
      poolId,
      grade,
      category,
    },
  })

  return NextResponse.json(question, { status: 201 })
}
