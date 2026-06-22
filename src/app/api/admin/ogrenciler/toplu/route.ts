import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"
import bcrypt from "bcryptjs"

function toAscii(str: string): string {
  return str
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/\s+/g, "")
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 })

  const { students, schoolId, supplierId } = await req.json()

  if (!Array.isArray(students) || students.length === 0)
    return NextResponse.json({ message: "Ogrenci listesi bos olamaz." }, { status: 400 })

  type Credential = { name: string; username: string; password: string; grade: number; classroom: string }

  const usedUsernames = new Set<string>()
  const credentials: Credential[] = []

  const existingUsernames = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true },
  })
  const dbUsernames = new Set(existingUsernames.map((u) => u.username!))

  for (const s of students) {
    const { name, grade, classroom } = s
    if (!name || !grade || !classroom) continue

    const base = toAscii(name.trim())
    const suffix = `_${grade}${String(classroom).toLowerCase()}`
    let candidate = base + suffix

    if (dbUsernames.has(candidate) || usedUsernames.has(candidate)) {
      const random = Math.floor(10 + Math.random() * 90).toString()
      candidate = candidate + random
    }

    usedUsernames.add(candidate)
    const plain = Math.floor(1000 + Math.random() * 9000).toString()
    credentials.push({ name: name.trim(), username: candidate, password: plain, grade, classroom })
  }

  const creates = await Promise.all(
    credentials.map(async (c) => ({
      username:   c.username,
      password:   await bcrypt.hash(c.password, 10),
      name:       c.name,
      role:       "STUDENT" as const,
      isActive:   true,
      schoolId:   schoolId || null,
      supplierId: supplierId || null,
    }))
  )

  await prisma.$transaction(
    creates.map((data) =>
      prisma.user.create({
        data: {
          ...data,
          student: {
            create: { schoolId: data.schoolId },
          },
        },
      })
    )
  )

  return NextResponse.json({
    created: credentials.length,
    credentials: credentials.map(({ name, username, password, grade, classroom }) => ({
      name, username, password, grade, classroom,
    })),
  }, { status: 201 })
}
