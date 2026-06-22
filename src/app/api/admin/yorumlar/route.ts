import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const data = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { quote, author, role, photoUrl, isActive, order } = await req.json()

  if (!quote?.trim()) return NextResponse.json({ message: "Yorum metni zorunludur." }, { status: 400 })
  if (!author?.trim()) return NextResponse.json({ message: "Ad Soyad zorunludur." }, { status: 400 })
  if (!role?.trim()) return NextResponse.json({ message: "Unvan zorunludur." }, { status: 400 })

  const item = await prisma.testimonial.create({
    data: {
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim(),
      photoUrl: photoUrl?.trim() || null,
      isActive: isActive ?? true,
      order: order ?? 0,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
