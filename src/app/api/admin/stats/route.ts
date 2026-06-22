import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const [
    okulSayisi,
    ogrenciSayisi,
    tedarikciSayisi,
    sinavSayisi,
    bekleyenTransfer,
    aktifKullanici,
  ] = await prisma.$transaction([
    prisma.school.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.supplier.count({ where: { isActive: true } }),
    prisma.exam.count(),
    prisma.transfer.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { isActive: true } }),
  ])

  return NextResponse.json({
    okulSayisi,
    ogrenciSayisi,
    tedarikciSayisi,
    sinavSayisi,
    bekleyenTransfer,
    aktifKullanici,
  })
}
