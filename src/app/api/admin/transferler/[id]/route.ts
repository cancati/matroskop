import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { action } = await req.json()

  if (action !== "APPROVE" && action !== "REJECT") {
    return NextResponse.json({ message: "Gecersiz islem." }, { status: 400 })
  }

  const transfer = await prisma.transfer.findUnique({
    where: { id: params.id },
    include: { student: { select: { id: true, userId: true } } },
  })

  if (!transfer) return NextResponse.json({ message: "Transfer bulunamadi." }, { status: 404 })
  if (transfer.status !== "PENDING") {
    return NextResponse.json({ message: "Bu transfer zaten isleme alindi." }, { status: 400 })
  }

  if (action === "APPROVE") {
    await prisma.$transaction([
      prisma.transfer.update({
        where: { id: params.id },
        data: { status: "APPROVED", resolvedAt: new Date() },
      }),
      prisma.student.update({
        where: { id: transfer.studentId },
        data: { schoolId: transfer.toSchoolId, classroomId: null },
      }),
      prisma.user.update({
        where: { id: transfer.student.userId },
        data: { schoolId: transfer.toSchoolId },
      }),
    ])
  } else {
    await prisma.transfer.update({
      where: { id: params.id },
      data: { status: "REJECTED", resolvedAt: new Date() },
    })
  }

  return NextResponse.json({ message: action === "APPROVE" ? "Transfer onaylandi." : "Transfer reddedildi." })
}
