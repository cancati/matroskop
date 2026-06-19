import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Kullanici adi/e-posta veya sifre hatali." },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { message: "Kullanici adi/e-posta veya sifre hatali." },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      user: {
        id:          user.id,
        email:       user.email ?? undefined,
        username:    user.username ?? undefined,
        name:        user.name,
        role:        user.role,
        isActive:    user.isActive,
        schoolId:    user.schoolId ?? undefined,
        supplierId:  user.supplierId ?? undefined,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7, // 7 gün
      path:     "/",
    })

    return response

  } catch {
    return NextResponse.json(
      { message: "Sunucu hatası." },
      { status: 500 }
    )
  }
}
