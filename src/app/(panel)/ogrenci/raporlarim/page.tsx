"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, FileText } from "lucide-react"

interface ExamStat { correct: number; wrong: number; blank: number }

interface CompletedExam {
  id: string
  grade: number
  createdAt: string
  endedAt: string | null
  result: { G57: number; G58: number; G59: number; G76: number; level: string } | null
  stats: { G57: ExamStat; G58: ExamStat; G59: ExamStat }
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-red-100 text-red-700",
  A2: "bg-orange-100 text-orange-700",
  B1: "bg-yellow-100 text-yellow-700",
  B2: "bg-green-100 text-green-700",
  C1: "bg-blue-100 text-blue-700",
  C2: "bg-brand-light text-brand",
}

function StatBar({ label, stat }: { label: string; stat: ExamStat }) {
  const total = stat.correct + stat.wrong + stat.blank || 1
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-brand">{label}</span>
        <span className="text-[12px] text-muted">{stat.correct}/{stat.correct + stat.wrong + stat.blank}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-surface-section">
        {stat.correct > 0 && (
          <div className="bg-green-500 h-full" style={{ width: `${(stat.correct / total) * 100}%` }} />
        )}
        {stat.wrong > 0 && (
          <div className="bg-red-400 h-full" style={{ width: `${(stat.wrong / total) * 100}%` }} />
        )}
      </div>
      <div className="flex gap-3 text-[11px]">
        <span className="text-green-600">Dogru: {stat.correct}</span>
        <span className="text-red-500">Yanlis: {stat.wrong}</span>
        <span className="text-muted">Bos: {stat.blank}</span>
      </div>
    </div>
  )
}

export default function RaporlarimPage() {
  const [exams, setExams] = useState<CompletedExam[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sinav/raporlar")
      .then((r) => r.json())
      .then((data) => { setExams(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "2-digit", month: "long", year: "numeric",
    })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Raporlarım</h1>
        <p className="text-muted text-[14px] mt-0.5">Tamamladıgınız sınavların sonuçları.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-form-border p-12 flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-muted/30" />
          <p className="text-muted text-[14px]">Henuz tamamlanmis sinavınız yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exams.map((exam) => {
            const isOpen = expanded === exam.id
            const levelColor = exam.result
              ? (LEVEL_COLORS[exam.result.level] ?? "bg-surface-section text-muted")
              : "bg-surface-section text-muted"

            return (
              <div key={exam.id} className="bg-white rounded-2xl border border-form-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-[14px] font-semibold text-brand">{formatDate(exam.createdAt)}</p>
                    <p className="text-[12px] text-muted mt-0.5">{exam.grade}. Sınıf</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {exam.result && (
                      <>
                        <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${levelColor}`}>
                          {exam.result.level}
                        </span>
                        <div className="text-right">
                          <p className="text-[18px] font-bold text-brand leading-none">
                            {exam.result.G76.toFixed(1)}
                          </p>
                          <p className="text-[10px] text-muted">G76</p>
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => setExpanded(isOpen ? null : exam.id)}
                      className="text-muted hover:text-brand transition-colors p-1"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isOpen && exam.result && (
                  <div className="border-t border-form-border px-5 py-4 bg-surface-section flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4 pb-3 border-b border-form-border">
                      {[
                        { label: "Akademik Mat.", val: exam.result.G57 },
                        { label: "Ileri Beceriler", val: exam.result.G58 },
                        { label: "Okuryazarlık", val: exam.result.G59 },
                      ].map(({ label, val }) => (
                        <div key={label} className="text-center">
                          <p className="text-[20px] font-bold text-brand">{val.toFixed(1)}</p>
                          <p className="text-[10px] text-muted">{label}</p>
                        </div>
                      ))}
                    </div>
                    <StatBar label="Akademik Matematik" stat={exam.stats.G57} />
                    <StatBar label="Ileri Beceriler"    stat={exam.stats.G58} />
                    <StatBar label="Okuryazarlık"       stat={exam.stats.G59} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
