"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import type { QuestionData } from "@/types/admin"

const CATEGORIES = ["G57", "G58", "G59"] as const
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"]

const schema = z.object({
  content:       z.string().min(5, "Soru metni en az 5 karakter olmalidir"),
  option0:       z.string().min(1, "Sik bos olamaz"),
  option1:       z.string().min(1, "Sik bos olamaz"),
  option2:       z.string().min(1, "Sik bos olamaz"),
  option3:       z.string().min(1, "Sik bos olamaz"),
  correctAnswer: z.number().min(0).max(3),
  poolId:        z.number().min(1).max(50),
  grade:         z.number().min(1).max(8),
  category:      z.enum(CATEGORIES),
})

type FormData = z.infer<typeof schema>

interface SoruModalProps {
  isOpen:    boolean
  onClose:   () => void
  soru?:     QuestionData | null
  onSuccess: () => void
}

export function SoruModal({ isOpen, onClose, soru, onSuccess }: SoruModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { correctAnswer: 0, grade: 3, category: "G57", poolId: 1 },
  })

  const correctVal = watch("correctAnswer")

  useEffect(() => {
    if (isOpen) {
      reset({
        content:       soru?.content ?? "",
        option0:       soru?.options[0] ?? "",
        option1:       soru?.options[1] ?? "",
        option2:       soru?.options[2] ?? "",
        option3:       soru?.options[3] ?? "",
        correctAnswer: soru?.correctAnswer ?? 0,
        poolId:        soru?.poolId ?? 1,
        grade:         soru?.grade ?? 3,
        category:      (soru?.category as typeof CATEGORIES[number]) ?? "G57",
      })
      setError(null)
    }
  }, [isOpen, soru, reset])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    const body = {
      content:       data.content,
      options:       [data.option0, data.option1, data.option2, data.option3],
      correctAnswer: data.correctAnswer,
      poolId:        data.poolId,
      grade:         data.grade,
      category:      data.category,
    }
    try {
      const res = await fetch(
        soru ? `/api/admin/sorular/${soru.id}` : "/api/admin/sorular",
        { method: soru ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? "Bir hata olustu.")
      onSuccess()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata olustu.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-semibold text-brand">{soru ? "Soru Duzenle" : "Yeni Soru Ekle"}</h2>
          <button onClick={onClose} className="text-muted hover:text-brand transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-[13px] mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-brand mb-1.5">Soru Metni *</label>
            <textarea
              {...register("content")}
              rows={3}
              className="w-full border border-form-border rounded-xl px-4 py-2.5 text-[15px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted resize-none"
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand">Siklar (dogru siki isaretleyin)</label>
            {([0, 1, 2, 3] as const).map((i) => (
              <div key={i} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setValue("correctAnswer", i)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-colors ${
                    correctVal === i
                      ? "border-brand bg-brand text-white"
                      : "border-form-border text-muted hover:border-brand"
                  }`}
                >
                  {OPTION_LETTERS[i]}
                </button>
                <input
                  {...register(`option${i}` as "option0" | "option1" | "option2" | "option3")}
                  placeholder={`${OPTION_LETTERS[i]} sikki`}
                  className="flex-1 border border-form-border rounded-xl px-4 py-2 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-muted"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand mb-1.5">Kategori *</label>
              <select
                {...register("category")}
                className="w-full border border-form-border rounded-xl px-3 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand mb-1.5">Havuz ID *</label>
              <input
                {...register("poolId", { valueAsNumber: true })}
                type="number"
                min={1}
                max={50}
                className="w-full border border-form-border rounded-xl px-3 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
              {errors.poolId && <p className="text-red-500 text-xs mt-1">{errors.poolId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand mb-1.5">Sinif *</label>
              <select
                {...register("grade", { valueAsNumber: true })}
                className="w-full border border-form-border rounded-xl px-3 py-2.5 text-[14px] text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[1,2,3,4,5,6,7,8].map((g) => <option key={g} value={g}>{g}. Sinif</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-form-border text-brand rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-surface transition-colors">
              Iptal
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-brand text-white rounded-xl px-4 py-2.5 text-[14px] font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60">
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
