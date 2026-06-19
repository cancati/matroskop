import Link from "next/link"
import type { ElementType } from "react"

interface StatCardProps {
  title: string
  value: number | string
  icon: ElementType
  color: "brand" | "green" | "purple" | "orange" | "yellow"
  href?: string
}

const colorMap = {
  brand:  { bg: "bg-brand-light",  icon: "text-brand" },
  green:  { bg: "bg-green-100",    icon: "text-green-600" },
  purple: { bg: "bg-purple-100",   icon: "text-purple-600" },
  orange: { bg: "bg-orange-100",   icon: "text-orange-600" },
  yellow: { bg: "bg-yellow-100",   icon: "text-yellow-600" },
}

export function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
  const { bg, icon } = colorMap[color]

  const content = (
    <div className="bg-white rounded-2xl border border-form-border p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className={`${bg} rounded-xl p-3 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${icon}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-brand">{value}</p>
        <p className="text-[13px] text-muted mt-0.5">{title}</p>
      </div>
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}
