"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ExamQuestion {
  id: string
  questionId: string
  poolId: number
  content: string
  options: string[]
  selected: number
}

interface ExamData {
  examId: string
  questions: ExamQuestion[]
}

interface ExamResult {
  G57: number
  G58: number
  G59: number
  G76: number
  level: string
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"]

type ExamStatus = "checking" | "new" | "resume"

interface StartScreenProps {
  status: ExamStatus
  answeredCount: number
  totalCount: number
  onStart: () => void
  loading: boolean
}

function StartScreen({ status, answeredCount, totalCount, onStart, loading }: StartScreenProps) {
  if (status === "checking")
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-light border-t-brand rounded-full animate-spin" />
      </div>
    )

  const btnLabel = loading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Hazirlaniyor...
    </span>
  ) : status === "resume" ? "Kaldıgınız Yerden Devam Edin" : "Sınavı Baslat"

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-form-border p-8">
        {status === "resume" ? (
          <>
            <h1 className="text-xl font-bold text-brand mb-1">Sinav Devam Ediyor</h1>
            <p className="text-muted text-[14px] mb-6">Kaldıgınız yerden devam edebilirsiniz.</p>
            <div className="bg-surface-section rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-muted">Ilerleme</span>
                <span className="text-[13px] font-semibold text-brand">{answeredCount} / {totalCount} soru</span>
              </div>
              <div className="bg-brand-light rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full"
                  style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-brand mb-1">Matematik Degerlendirme Sinavi</h1>
            <p className="text-muted text-[14px] mb-6">Sinavi baslatmadan once bilgileri inceleyin.</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { value: "50", label: "Soru" },
                { value: "3", label: "Kategori" },
                { value: "~40dk", label: "Tahmini Sure" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-surface-section rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-brand">{value}</p>
                  <p className="text-[12px] text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mb-6">
              {[
                { name: "Akademik Matematik", soru: 20, yuzde: 40 },
                { name: "Ileri Beceriler",    soru: 15, yuzde: 30 },
                { name: "Okuryazarlık",       soru: 15, yuzde: 30 },
              ].map(({ name, soru, yuzde }) => (
                <div key={name} className="flex items-center justify-between bg-surface-section rounded-xl px-4 py-2.5">
                  <span className="text-[13px] font-medium text-brand">{name}</span>
                  <span className="text-[12px] text-muted">{soru} soru · %{yuzde}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-muted bg-brand-light rounded-xl px-4 py-3 mb-6">
              Sinav yarıda kapanırsa tekrar acıldıgında kaldıgınız yerden devam eder.
            </p>
          </>
        )}

        <button
          onClick={onStart}
          disabled={loading}
          className="w-full bg-brand text-white rounded-xl py-3 text-[15px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}

function ResultScreen({ result }: { result: ExamResult }) {
  const R = 56
  const circ = 2 * Math.PI * R
  const offset = circ * (1 - result.G76 / 100)

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand">Sinav Tamamlandi</h1>
        <p className="text-muted text-[14px] mt-1">Sonuclariniz asagida gosterilmektedir.</p>
      </div>

      <div className="w-full bg-brand rounded-3xl p-10 text-center text-white">
        <p className="text-[13px] text-white/60 mb-2">Matematik Seviyeniz</p>
        <p className="text-7xl font-black tracking-tight leading-none">{result.level}</p>
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {[
          { label: "Akademik Matematik", val: result.G57 },
          { label: "Ileri Beceriler",    val: result.G58 },
          { label: "Okuryazarlık",       val: result.G59 },
        ].map(({ label, val }) => (
          <div key={label} className="bg-white rounded-2xl border border-form-border p-4 text-center">
            <p className="text-[24px] font-bold text-brand leading-none">{val.toFixed(1)}</p>
            <p className="text-[10px] text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={R} fill="none" stroke="#e8eef6" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={R} fill="none"
          stroke="#033147" strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        />
        <text x="75" y="70" textAnchor="middle" fill="#033147" fontSize="24" fontWeight="700">
          {result.G76.toFixed(1)}
        </text>
        <text x="75" y="88" textAnchor="middle" fill="#888888" fontSize="11">
          Genel Puan
        </text>
      </svg>

      <Link
        href="/ogrenci/raporlarim"
        className="bg-brand text-white rounded-xl px-8 py-3 text-[15px] font-semibold hover:bg-brand-dark transition-colors"
      >
        Raporlarıma Git
      </Link>
    </div>
  )
}

export default function SinavPage() {
  const [phase, setPhase] = useState<"start" | "loading" | "exam" | "result">("start")
  const [examStatus, setExamStatus] = useState<ExamStatus>("checking")
  const [statusAnswered, setStatusAnswered] = useState(0)
  const [statusTotal, setStatusTotal] = useState(50)
  const [exam, setExam] = useState<ExamData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ExamResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetch("/api/sinav/durum")
      .then((r) => r.json())
      .then((data) => {
        if (data.hasActive && (data.answeredCount ?? 0) > 0) {
          setStatusAnswered(data.answeredCount ?? 0)
          setStatusTotal(data.totalCount ?? 50)
          setExamStatus("resume")
        } else {
          setExamStatus("new")
        }
      })
      .catch(() => setExamStatus("new"))
  }, [])

  const handleStart = async () => {
    setPhase("loading")
    setError(null)
    try {
      const res = await fetch("/api/sinav/baslat", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Sinav baslatilamadi.")
      const map: Record<string, number> = {}
      data.questions.forEach((q: ExamQuestion) => { map[q.id] = q.selected })
      setExam(data)
      setAnswers(map)
      const first = data.questions.findIndex((q: ExamQuestion) => q.selected === -1)
      if (first !== -1) setCurrentIndex(first)
      setPhase("exam")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sinav baslatilamadi.")
      setPhase("start")
    }
  }

  const selectOption = useCallback((q: ExamQuestion, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionIdx }))
    fetch("/api/sinav/cevapla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examAnswerId: q.id, selected: optionIdx }),
    })
  }, [])

  const navigate = (to: number | "prev" | "next", total: number) => {
    if (typeof to === "number") return setCurrentIndex(to)
    setCurrentIndex((i) =>
      to === "prev" ? Math.max(0, i - 1) : Math.min(total - 1, i + 1)
    )
  }

  const handleFinish = async () => {
    if (!exam) return
    setIsSubmitting(true)
    setShowConfirm(false)
    try {
      const res = await fetch("/api/sinav/bitir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: exam.examId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Sinav bitirilemedi.")
      setResult(data)
      setPhase("result")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sinav bitirilemedi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (phase === "start")
    return (
      <>
        {error && (
          <div className="max-w-md mx-auto mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-[13px]">
            {error}
          </div>
        )}
        <StartScreen
          status={examStatus}
          answeredCount={statusAnswered}
          totalCount={statusTotal}
          onStart={handleStart}
          loading={false}
        />
      </>
    )

  if (phase === "loading")
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-light border-t-brand rounded-full animate-spin" />
      </div>
    )

  if (phase === "result" && result) return <ResultScreen result={result} />

  if (!exam)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-700 text-[15px]">{error ?? "Sinav yuklenemedi."}</p>
      </div>
    )

  const { questions } = exam
  const current = questions[currentIndex]
  const answeredCount = Object.values(answers).filter((v) => v !== -1).length
  const unansweredCount = questions.length - answeredCount
  const progress = (answeredCount / questions.length) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* Üst çubuk — soru numarası büyük */}
      <div className="sticky top-0 z-10 bg-surface-section border-b border-form-border py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-1 leading-none flex-shrink-0">
            <span className="text-4xl font-black text-brand tabular-nums">{currentIndex + 1}</span>
            <span className="text-[14px] text-muted pb-1">/ {questions.length}</span>
          </div>
          <div className="flex-1 bg-brand-light rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[13px] text-muted whitespace-nowrap">{answeredCount}/{questions.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-[13px]">
          {error}
        </div>
      )}

      {/* Soru kartı */}
      <div className="bg-white rounded-2xl border border-form-border p-6">
        <div
          className="text-[16px] text-brand leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: current.content }}
        />
        <div className="space-y-3">
          {current.options.map((option, idx) => {
            const isSelected = answers[current.id] === idx
            return (
              <button
                key={idx}
                onClick={() => selectOption(current, idx)}
                className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-all ${
                  isSelected
                    ? "border-brand bg-brand-light"
                    : "border-form-border hover:border-brand/40"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-colors ${
                    isSelected ? "border-brand bg-brand text-white" : "border-form-border text-muted"
                  }`}
                >
                  {OPTION_LETTERS[idx]}
                </span>
                <span className={`text-[15px] ${isSelected ? "text-brand font-medium" : "text-brand"}`}>
                  {option}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Alt navigasyon */}
      <div className="bg-white rounded-2xl border border-form-border p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 items-center">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: 10 }).map((_, col) => {
                const idx = row * 10 + col
                const q = questions[idx]
                if (!q) return <div key={col} className="w-2.5 h-2.5" />
                const done = answers[q.id] !== -1
                const isCur = idx === currentIndex
                return (
                  <button
                    key={col}
                    onClick={() => navigate(idx, questions.length)}
                    title={`Soru ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isCur
                        ? done
                          ? "bg-brand ring-2 ring-brand ring-offset-1"
                          : "bg-white border-2 border-brand"
                        : done
                        ? "bg-brand"
                        : "bg-white border border-form-border hover:border-brand/50"
                    }`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("prev", questions.length)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-[14px] font-medium text-brand disabled:text-muted disabled:cursor-not-allowed hover:text-brand-dark transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Önceki
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => navigate("next", questions.length)}
              className="flex items-center gap-1 text-[14px] font-medium text-brand hover:text-brand-dark transition-colors"
            >
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isSubmitting}
              className="bg-cta text-white rounded-xl px-5 py-2 text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              Sinavı Bitir
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-[17px] font-semibold text-brand mb-2">Sinavı Bitir</h3>
            {unansweredCount > 0 ? (
              <p className="text-muted text-[14px] mb-5">
                <span className="text-red-600 font-semibold">{unansweredCount} soru</span>{" "}
                cevaplanmadi. Sinavi yine de bitirmek istiyor musunuz?
              </p>
            ) : (
              <p className="text-muted text-[14px] mb-5">
                Tum sorulari cevapladınız. Sinavı bitirmek istiyor musunuz?
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-form-border text-brand rounded-xl py-2.5 text-[14px] font-medium hover:bg-surface transition-colors"
              >
                Devam Et
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 bg-cta text-white rounded-xl py-2.5 text-[14px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {isSubmitting ? "Bitiriliyor..." : "Bitir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
