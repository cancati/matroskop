import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(data)
}
