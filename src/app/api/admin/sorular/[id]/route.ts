import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const question = await prisma.question.findUnique({ where: { id: params.id } })
  if (!question) return NextResponse.json({ message: "Soru bulunamadi." }, { status: 404 })

  return NextResponse.json(question)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { content, options, correctAnswer, poolId, grade, category, isActive } = await req.json()

  if (content !== undefined && content.trim().length < 5)
    return NextResponse.json({ message: "Soru metni en az 5 karakter olmalidir." }, { status: 400 })
  if (options !== undefined && (!Array.isArray(options) || options.length < 4 || options.length > 6))
    return NextResponse.json({ message: "4-6 arasi sik girilmelidir." }, { status: 400 })
  if (category !== undefined && !["G57","G58","G59"].includes(category))
    return NextResponse.json({ message: "Kategori G57, G58 veya G59 olmalidir." }, { status: 400 })

  const question = await prisma.question.update({
    where: { id: params.id },
    data: {
      ...(content       !== undefined && { content: content.trim() }),
      ...(options       !== undefined && { options: options.map((o: string) => o.trim()) }),
      ...(correctAnswer !== undefined && { correctAnswer }),
      ...(poolId        !== undefined && { poolId }),
      ...(grade         !== undefined && { grade }),
      ...(category      !== undefined && { category }),
      ...(isActive      !== undefined && { isActive }),
    },
  })

  return NextResponse.json(question)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  await prisma.question.update({ where: { id: params.id }, data: { isActive: false } })
  return NextResponse.json({ message: "Soru pasife alindi." })
}
