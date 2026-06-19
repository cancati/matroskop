"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { useAuth } from "@/hooks/useAuth"
import { NAV_ITEMS, ROLE_LABELS } from "./nav-items"

interface MobilMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobilMenu({ isOpen, onClose }: MobilMenuProps) {
  const { user } = useAuthStore()
  const { signOut } = useAuth()
  const pathname = usePathname()

  if (!isOpen || !user) return null

  const items = NAV_ITEMS[user.role]
  const initials = user.name.charAt(0).toUpperCase()

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-64 bg-brand z-50 flex flex-col">

        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
          <span className="text-white font-black text-xl">Matroskop</span>
          <span className="w-2 h-2 rounded-full bg-accent-yellow" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Kullanici */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[14px]">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">{user.name}</div>
            <div className="text-white/50 text-[11px]">{ROLE_LABELS[user.role]}</div>
          </div>
          <button onClick={signOut} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </>
  )
}
