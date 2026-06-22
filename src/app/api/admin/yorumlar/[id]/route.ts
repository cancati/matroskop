import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { quote, author, role, photoUrl, isActive, order } = await req.json()

  if (!quote?.trim()) return NextResponse.json({ message: "Yorum metni zorunludur." }, { status: 400 })
  if (!author?.trim()) return NextResponse.json({ message: "Ad Soyad zorunludur." }, { status: 400 })
  if (!role?.trim()) return NextResponse.json({ message: "Unvan zorunludur." }, { status: 400 })

  const item = await prisma.testimonial.update({
    where: { id: params.id },
    data: {
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim(),
      photoUrl: photoUrl?.trim() || null,
      isActive: isActive ?? true,
      order: order ?? 0,
    },
  })
  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  await prisma.testimonial.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
