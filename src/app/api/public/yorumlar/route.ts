import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const data = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(data)
}
