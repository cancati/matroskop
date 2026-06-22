"use client"

import { useEffect, useState } from "react"
import { BarChart2, ChevronDown, ChevronUp } from "lucide-react"

interface ExamRecord {
  id: string
  grade: number
  endedAt: string | null
  createdAt: string
  result: { G57: number; G58: number; G59: number; G76: number; level: string } | null
}

interface StudentReport {
  id: string
  name: string
  username: string
  exams: ExamRecord[]
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-red-100 text-red-700",
  A2: "bg-orange-100 text-orange-700",
  B1: "bg-yellow-100 text-yellow-700",
  B2: "bg-blue-100 text-blue-700",
  C1: "bg-green-100 text-green-700",
  C2: "bg-emerald-100 text-emerald-700",
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-brand tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-brand-light rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  )
}

export default function TedarikciRaporlarPage() {
  const [reports, setReports] = useState<StudentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/tedarikci/raporlar")
      .then((r) => r.json())
      .then(setReports)
      .catch(() => setError("Veriler yuklenemedi."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-brand-light rounded-2xl h-20" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-[14px]">{error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand">Raporlar</h1>
        <p className="text-muted text-[14px] mt-0.5">Ogrencilerin sinav gecmisi</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-form-border p-12 flex flex-col items-center gap-3">
          <BarChart2 className="w-10 h-10 text-muted/30" />
          <p className="text-muted text-[14px]">Henuz tamamlanmis sinav bulunmuyor.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((student) => {
            const lastExam = student.exams[0]
            const isOpen = expanded === student.id
            return (
              <div key={student.id} className="bg-white rounded-2xl border border-form-border overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : student.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-[15px] font-semibold text-brand">{student.name}</p>
                      <p className="text-[12px] text-muted font-mono">{student.username}</p>
                    </div>
                    <span className="text-[13px] text-muted">{student.exams.length} sinav</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {lastExam?.result && (
                      <>
                        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${LEVEL_COLORS[lastExam.result.level] ?? "bg-gray-100 text-gray-700"}`}>
                          {lastExam.result.level}
                        </span>
                        <span className="text-[15px] font-bold text-brand tabular-nums w-12 text-right">
                          {lastExam.result.G76.toFixed(1)}
                        </span>
                      </>
                    )}
                    {student.exams.length === 0 && (
                      <span className="text-muted text-[13px]">Sinav yok</span>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                  </div>
                </button>

                {isOpen && student.exams.length > 0 && (
                  <div className="border-t border-form-border divide-y divide-form-border">
                    {student.exams.map((exam) => (
                      <div key={exam.id} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-[13px] text-muted">
                              {exam.endedAt
                                ? new Date(exam.endedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                                : new Date(exam.createdAt).toLocaleDateString("tr-TR")}
                            </p>
                            <p className="text-[12px] text-muted/70">{exam.grade}. Sinif</p>
                          </div>
                          {exam.result && (
                            <div className="flex items-center gap-3">
                              <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${LEVEL_COLORS[exam.result.level] ?? "bg-gray-100 text-gray-700"}`}>
                                {exam.result.level}
                              </span>
                              <span className="text-[18px] font-black text-brand tabular-nums">
                                {exam.result.G76.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        {exam.result && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <ScoreBar label="Akademik Matematik" value={exam.result.G57} />
                            <ScoreBar label="Ileri Beceriler" value={exam.result.G58} />
                            <ScoreBar label="Okuryazarlik" value={exam.result.G59} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isOpen && student.exams.length === 0 && (
                  <div className="border-t border-form-border px-6 py-6 text-center text-muted text-[14px]">
                    Henuz tamamlanmis sinav bulunmuyor.
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
