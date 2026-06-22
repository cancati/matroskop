"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Bell } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { NAV_ITEMS } from "./nav-items"
import { MobilMenu } from "./MobilMenu"

export function Topbar() {
  const { user } = useAuthStore()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = user ? NAV_ITEMS[user.role] : []
  const currentItem = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )
  const pageTitle = currentItem?.label ?? "Panel"
  const initials = user?.name.charAt(0).toUpperCase() ?? ""

  return (
    <>
      <header className="bg-white border-b border-form-border h-16 px-6 flex items-center justify-between sticky top-0 z-10">

        {/* Sol */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-muted hover:text-brand transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="hidden md:block text-[17px] font-semibold text-brand">
            {pageTitle}
          </span>
        </div>

        {/* Sag */}
        <div className="flex items-center gap-3">
          <button className="text-muted hover:text-brand transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-form-border" />

          <div className="bg-surface-section rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[12px] font-bold">{initials}</span>
            </div>
            <span className="text-[13px] font-medium text-brand hidden sm:block max-w-[120px] truncate">
              {user?.name}
            </span>
          </div>
        </div>

      </header>

      <MobilMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
