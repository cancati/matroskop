"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  School, Users, Building2, BookCheck,
  ArrowLeftRight, UserCheck, LayoutDashboard,
  BookOpen, ClipboardList, FileText,
} from "lucide-react"
import { StatCard } from "@/components/sistem-yoneticisi/StatCard"
import type { AdminStats } from "@/types/admin"

const QUICK_LINKS = [
  { label: "Okullar", desc: "Okul ekle ve yonet", href: "/sistem-yoneticisi/okullar", icon: School },
  { label: "Tedarikciler", desc: "Tedarikci kayitlari", href: "/sistem-yoneticisi/tedarikciler", icon: Building2 },
  { label: "Kullanicilar", desc: "Kullanici hesaplari", href: "/sistem-yoneticisi/kullanicilar", icon: Users },
  { label: "Soru Bankasi", desc: "Soru ekle ve duzenle", href: "/sistem-yoneticisi/soru-bankasi", icon: BookOpen },
  { label: "Sinav Sablonlari", desc: "Sablon olustur", href: "/sistem-yoneticisi/sinav-sablonlari", icon: ClipboardList },
  { label: "Transferler", desc: "Transfer talepleri", href: "/sistem-yoneticisi/transferler", icon: ArrowLeftRight },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/stats")
      if (res.ok) setStats(await res.json())
      setLoading(false)
    }
    load()
  }, [])

  const today = new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Sistem Yonetimi</h1>
        <p className="text-muted text-[14px] mt-1 capitalize">{today}</p>
      </div>

      {stats?.bekleyenTransfer ? (
        <Link
          href="/sistem-yoneticisi/transferler"
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-yellow-100 transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-[14px] font-medium text-yellow-800">
            {stats.bekleyenTransfer} bekleyen transfer talebi var — inceleyin
          </p>
        </Link>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-brand-light rounded-2xl h-28" />
          ))
        ) : (
          <>
            <StatCard title="Toplam Okul" value={stats?.okulSayisi ?? 0} icon={School} color="brand" href="/sistem-yoneticisi/okullar" />
            <StatCard title="Toplam Ogrenci" value={stats?.ogrenciSayisi ?? 0} icon={Users} color="green" href="/sistem-yoneticisi/kullanicilar" />
            <StatCard title="Toplam Tedarikci" value={stats?.tedarikciSayisi ?? 0} icon={Building2} color="purple" href="/sistem-yoneticisi/tedarikciler" />
            <StatCard title="Toplam Sinav" value={stats?.sinavSayisi ?? 0} icon={BookCheck} color="orange" />
            <StatCard title="Bekleyen Transfer" value={stats?.bekleyenTransfer ?? 0} icon={ArrowLeftRight} color="yellow" href="/sistem-yoneticisi/transferler" />
            <StatCard title="Aktif Kullanici" value={stats?.aktifKullanici ?? 0} icon={UserCheck} color="green" href="/sistem-yoneticisi/kullanicilar" />
          </>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-4 h-4 text-muted" />
          <h2 className="text-[15px] font-semibold text-brand">Hizli Erisim</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-form-border p-5 hover:border-brand/30 hover:shadow-sm transition-all flex items-start gap-4"
            >
              <div className="bg-brand-light rounded-xl p-2.5 flex-shrink-0">
                <item.icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-brand">{item.label}</p>
                <p className="text-muted text-[13px] mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-form-border p-5 flex items-center gap-4">
        <FileText className="w-5 h-5 text-muted flex-shrink-0" />
        <div>
          <p className="text-[14px] font-semibold text-brand">Raporlar</p>
          <p className="text-muted text-[13px]">Detayli raporlar yakin zamanda eklenecek.</p>
        </div>
      </div>
    </div>
  )
}
