import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/admin-auth"

export async function GET() {
  const auth = requireAuth()
  if (!auth || auth.role !== "SCHOOL_ADMIN")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const authUser = await prisma.user.findUnique({ where: { id: auth.id }, select: { schoolId: true } })
  if (!authUser?.schoolId) return NextResponse.json({ message: "Okul kaydı bulunamadı." }, { status: 404 })

  const transfers = await prisma.transfer.findMany({
    where: {
      OR: [
        { student: { schoolId: authUser.schoolId } },
        { toSchoolId: authUser.schoolId },
      ],
    },
    include: {
      student: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { requestedAt: "desc" },
  })

  const toSchoolIds = Array.from(new Set(transfers.map((t) => t.toSchoolId).filter(Boolean)))
  const fromSchoolIds = Array.from(new Set(transfers.map((t) => t.fromSchoolId).filter((id): id is string => !!id)))
  const allSchoolIds = Array.from(new Set([...toSchoolIds, ...fromSchoolIds]))

  const schools = await prisma.school.findMany({
    where: { id: { in: allSchoolIds } },
    select: { id: true, name: true },
  })

  const schoolMap = Object.fromEntries(schools.map((s) => [s.id, s.name]))

  return NextResponse.json(
    transfers.map((t) => ({
      id: t.id,
      status: t.status,
      studentName: t.student.user.name,
      fromSchool: t.fromSchoolId ? (schoolMap[t.fromSchoolId] ?? t.fromSchoolId) : null,
      toSchool: schoolMap[t.toSchoolId] ?? t.toSchoolId,
      note: t.note,
      requestedAt: t.requestedAt,
      resolvedAt: t.resolvedAt,
    }))
  )
}

export async function POST(req: NextRequest) {
  const auth = requireAuth()
  if (!auth || auth.role !== "SCHOOL_ADMIN")
    return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const authUser = await prisma.user.findUnique({ where: { id: auth.id }, select: { schoolId: true } })
  if (!authUser?.schoolId) return NextResponse.json({ message: "Okul kaydı bulunamadı." }, { status: 404 })

  const { studentId, toSchoolId, note } = await req.json()

  if (!studentId || !toSchoolId)
    return NextResponse.json({ message: "Ogrenci ve hedef okul zorunludur." }, { status: 400 })

  const student = await prisma.student.findUnique({ where: { id: studentId } })
  if (!student || student.schoolId !== authUser.schoolId)
    return NextResponse.json({ message: "Bu ogrenci okulunuza kayitli degil." }, { status: 403 })

  const toSchool = await prisma.school.findUnique({ where: { id: toSchoolId } })
  if (!toSchool)
    return NextResponse.json({ message: "Hedef okul bulunamadı." }, { status: 404 })

  const transfer = await prisma.transfer.create({
    data: {
      studentId,
      fromSchoolId: authUser.schoolId,
      toSchoolId,
      note: note?.trim() || null,
    },
  })

  return NextResponse.json(transfer, { status: 201 })
}
