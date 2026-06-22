/**
 * Soru import scripti
 * Çalıştırma: npx ts-node --project tsconfig.scripts.json scripts/import-questions.ts
 *
 * Gerekli env değişkenleri (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DATABASE_URL
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })
dotenv.config({ path: path.join(process.cwd(), '.env') })

// ─── Sabitler ────────────────────────────────────────────────────────────────

const BUCKET = 'question-images'
const IMG_PATTERN = 'https://app\\.matroskop\\.com/storage/question-images/[^"]+'
const DELAY_MS = 100

function imgRegex() {
  return new RegExp(IMG_PATTERN, 'g')
}

// ─── Tipler ──────────────────────────────────────────────────────────────────

interface RawOption {
  index: number
  content: string
}

interface RawQuestion {
  id: number
  pool_id: number
  pool_name: string
  pool_type: string
  grade: number
  content: string
  options: RawOption[]
  correct_answer: number
}

// ─── Yardımcılar ─────────────────────────────────────────────────────────────

function deriveCategory(poolNumber: number): string {
  if (poolNumber <= 20) return 'G57'
  if (poolNumber <= 35) return 'G58'
  return 'G59'
}

function extractImageUrls(questions: RawQuestion[]): string[] {
  const allHtml = questions
    .flatMap(q => [q.content, ...q.options.map(o => o.content)])
    .join('"')
  const re = imgRegex()
  const raw = allHtml.match(re) ?? []
  const seen = new Set<string>()
  for (const url of raw) seen.add(url)
  return Array.from(seen)
}

function replaceImageUrls(html: string, urlMap: Map<string, string>): string {
  return html.replace(imgRegex(), match => urlMap.get(match) ?? match)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Adım 1: Bucket ──────────────────────────────────────────────────────────

async function ensureBucket(supabase: ReturnType<typeof createClient>): Promise<void> {
  const { data: buckets, error } = await supabase.storage.listBuckets()
  if (error) throw new Error(`Bucket listesi alınamadı: ${error.message}`)

  const exists = buckets?.some(b => b.name === BUCKET)
  if (exists) {
    console.log(`Bucket zaten mevcut: "${BUCKET}"`)
    return
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (createError) throw new Error(`Bucket oluşturulamadı: ${createError.message}`)
  console.log(`Bucket oluşturuldu: "${BUCKET}"`)
}

// ─── Adım 2: Görsel migration ─────────────────────────────────────────────────

async function migrateImages(
  supabase: ReturnType<typeof createClient>,
  questions: RawQuestion[]
): Promise<Map<string, string>> {
  const urls = extractImageUrls(questions)
  console.log(`\n[Görseller] ${urls.length} benzersiz URL tespit edildi`)

  const urlMap = new Map<string, string>()
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const filename = url.split('/').pop()!

    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        timeout: 15_000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://app.matroskop.com/',
        },
      })

      const buffer = Buffer.from(response.data)
      const contentType = String(response.headers['content-type'] ?? 'image/png')

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, buffer, { contentType, upsert: true })

      if (uploadError) throw new Error(uploadError.message)

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
      urlMap.set(url, data.publicUrl)
      successCount++

      if ((i + 1) % 50 === 0) {
        console.log(`  [Görseller] ${i + 1}/${urls.length} işlendi...`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  [Görsel HATA] ${filename}: ${msg}`)
      failCount++
    }

    await sleep(DELAY_MS)
  }

  console.log(`[Görseller] ${successCount} başarılı, ${failCount} başarısız`)
  return urlMap
}

// ─── Adım 3: Soru import ─────────────────────────────────────────────────────

async function importQuestions(
  prisma: PrismaClient,
  questions: RawQuestion[],
  urlMap: Map<string, string>
): Promise<{ added: number; updated: number; skipped: number }> {
  const existingIds = new Set(
    (
      await prisma.question.findMany({
        where: { externalId: { not: null } },
        select: { externalId: true },
      })
    ).map(q => q.externalId!)
  )

  let added = 0
  let updated = 0
  let skipped = 0

  for (const raw of questions) {
    try {
      const poolNumber = parseInt(raw.pool_name, 10)

      const data = {
        content: replaceImageUrls(raw.content, urlMap),
        options: raw.options
          .sort((a, b) => a.index - b.index)
          .map(o => replaceImageUrls(o.content, urlMap)),
        correctAnswer: raw.correct_answer - 1,
        poolNumber,
        poolType: raw.pool_type,
        grade: raw.grade ?? null,
        category: deriveCategory(poolNumber),
        isActive: true,
      }

      await prisma.question.upsert({
        where: { externalId: raw.id },
        create: { ...data, externalId: raw.id },
        update: data,
      })

      if (existingIds.has(raw.id)) {
        updated++
      } else {
        added++
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  [Soru HATA] id=${raw.id}: ${msg}`)
      skipped++
    }
  }

  return { added, updated, skipped }
}

// ─── Ana akış ─────────────────────────────────────────────────────────────────

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY env değişkenleri gerekli'
    )
  }

  const jsonPath = path.join(process.cwd(), 'public', 'matroskop-questions.json')
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON dosyası bulunamadı: ${jsonPath}`)
  }

  const questions: RawQuestion[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`JSON yüklendi: ${questions.length} soru`)

  const supabase = createClient(supabaseUrl, supabaseKey)
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    // Adım 1
    await ensureBucket(supabase)

    // Adım 2
    const urlMap = await migrateImages(supabase, questions)

    // Adım 3
    console.log('\n[Sorular] Import başlıyor...')
    const { added, updated, skipped } = await importQuestions(prisma, questions, urlMap)

    console.log(`\n${'─'.repeat(50)}`)
    console.log(`Sorular: ${added} eklendi, ${updated} güncellendi, ${skipped} atlandı`)
    console.log(`${'─'.repeat(50)}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(err => {
  console.error('\n[HATA]', err instanceof Error ? err.message : err)
  process.exit(1)
})
