import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ─── YARDIMCI ─────────────────────────────────────────────────────────────────

function ri(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function calcLevel(g76: number): string {
  if (g76 < 30) return "A1"
  if (g76 < 45) return "A2"
  if (g76 < 60) return "B1"
  if (g76 < 75) return "B2"
  if (g76 < 90) return "C1"
  return "C2"
}

function wrongAnswer(correct: number, optCount: number): number {
  let w: number
  do { w = Math.floor(Math.random() * optCount) } while (w === correct)
  return w
}

function pastDate(daysAgo: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d
}

// ─── İSİM HAVUZU ──────────────────────────────────────────────────────────────

const MALES   = ["Ali","Mehmet","Ahmet","Mustafa","Huseyin","Emre","Burak","Furkan","Mert","Can","Omer","Enes","Kerem","Serhat","Baran","Musa","Ibrahim","Yusuf","Berkay","Alp","Oguz","Tarik","Selim","Umut","Cihan"]
const FEMALES = ["Ayse","Fatma","Zeynep","Hatice","Merve","Elif","Selin","Ceren","Busra","Dilan","Irem","Yagmur","Ebru","Melis","Asli","Dilara","Cansu","Gizem","Derya","Nisa","Sude","Buse","Lale","Gulce","Eylul"]
const SURNAMES = ["Yilmaz","Kaya","Demir","Celik","Sahin","Yildiz","Ozturk","Aydin","Arslan","Dogan","Kilic","Aslan","Koc","Kurt","Cetin","Bulut","Gunes","Korkmaz","Polat","Tekin","Yildirim","Erdogan","Eroglu","Gultekin","Pamuk"]

const usedNames     = new Set<string>()
const usedUsernames = new Set<string>()

function genName(): { name: string; first: string; last: string } {
  let first: string, last: string, key: string
  do {
    first = Math.random() > 0.5 ? pick(MALES) : pick(FEMALES)
    last  = pick(SURNAMES)
    key   = `${first}${last}`
  } while (usedNames.has(key))
  usedNames.add(key)
  return { name: `${first} ${last}`, first, last }
}

function makeUsername(first: string, last: string, suffix: string): string {
  const base = `${first.toLowerCase()}${last.toLowerCase()}_${suffix}`
  if (!usedUsernames.has(base)) { usedUsernames.add(base); return base }
  for (let i = 2; i < 99; i++) {
    const u = `${base}${i}`
    if (!usedUsernames.has(u)) { usedUsernames.add(u); return u }
  }
  throw new Error("Username alanı tükendi")
}

// ─── SORU VERİSİ ──────────────────────────────────────────────────────────────
// [poolId, category, content, options[], correctAnswer]
type QDef = [number, string, string, string[], number]

const GRADE3_QUESTIONS: QDef[] = [
  // ── G57 (poolId 1-20) ─────────────────────────────────────────────────────
  [1,  "G57", "345 + 234 kactir?",                                                  ["569","579","589","599"], 1],
  [2,  "G57", "876 - 432 kactir?",                                                  ["424","434","444","454"], 1],
  [3,  "G57", "6 x 7 kactir?",                                                      ["36","42","48","54"],     1],
  [4,  "G57", "56 / 8 kactir?",                                                     ["6","7","8","9"],         1],
  [5,  "G57", "Bir sayinin 3 kati 18'dir. Bu sayi kactir?",                          ["4","5","6","7"],         2],
  [6,  "G57", "125 + 375 kactir?",                                                  ["400","490","500","510"], 2],
  [7,  "G57", "900 - 456 kactir?",                                                  ["434","444","454","464"], 1],
  [8,  "G57", "9 x 8 kactir?",                                                      ["63","72","81","64"],     1],
  [9,  "G57", "72 / 9 kactir?",                                                     ["6","7","8","9"],         2],
  [10, "G57", "Bir kutuda 24 kalem var. 3 kutu kac kalemdir?",                       ["60","72","84","96"],     1],
  [11, "G57", "450 + 250 kactir?",                                                  ["600","650","700","750"], 2],
  [12, "G57", "730 - 280 kactir?",                                                  ["440","450","460","470"], 1],
  [13, "G57", "7 x 6 kactir?",                                                      ["36","42","48","56"],     1],
  [14, "G57", "81 / 9 kactir?",                                                     ["7","8","9","10"],        2],
  [15, "G57", "Bir sinifta 28 ogrenci var. 4 gruba esit bolunurse her grupta kac ogrenci olur?", ["5","6","7","8"], 2],
  [16, "G57", "199 + 301 kactir?",                                                  ["490","495","500","505"], 2],
  [17, "G57", "1000 - 375 kactir?",                                                 ["615","625","635","645"], 1],
  [18, "G57", "8 x 9 kactir?",                                                      ["63","72","81","64"],     1],
  [19, "G57", "48 / 6 kactir?",                                                     ["6","7","8","9"],         2],
  [20, "G57", "Ali'nin 5 paketi var. Her pakette 12 biskuvi var. Toplamda kac biskuvi vardir?", ["50","55","60","65"], 2],

  // ── G58 (poolId 21-35) ────────────────────────────────────────────────────
  [21, "G58", "Bir dikdortgenin uzun kenari 8 cm, kisa kenari 5 cm'dir. Cevresi kac cm'dir?",  ["24","26","28","30"],                                    1],
  [22, "G58", "Saat 09:30'da baslayan ders 45 dakika suruyor. Ders kacta biter?",               ["10:00","10:05","10:10","10:15"],                         3],
  [23, "G58", "Bir oruntude: 2, 4, 8, 16, ... Sonraki sayi kactir?",                           ["18","24","32","36"],                                    2],
  [24, "G58", "3 hafta kac gundur?",                                                            ["14","18","21","28"],                                    2],
  [25, "G58", "Bir karenin bir kenari 7 cm ise alani kac cm2'dir?",                             ["14","28","42","49"],                                    3],
  [26, "G58", "Bir oruntude: 100, 90, 80, 70, ... Sonraki sayi kactir?",                        ["55","60","65","70"],                                    1],
  [27, "G58", "2,5 saatin kac dakikasi vardir?",                                                ["120","130","140","150"],                                3],
  [28, "G58", "Bir sayinin yarisi 16 ise bu sayinin 3 kati kactir?",                            ["48","64","96","128"],                                   2],
  [29, "G58", "Bir oruntude: 1, 3, 6, 10, ... Sonraki sayi kactir?",                           ["13","14","15","16"],                                    2],
  [30, "G58", "Dikdortgeni 4 esit parcaya bolursek her parca butunun kacta kacidir?",           ["1/2","1/3","1/4","1/5"],                                2],
  [31, "G58", "Bir carkifelek esit 6 parcaya bolunmus. 2 parca sari ise sari gelme ihtimali?", ["1/6","1/3","1/2","2/3"],                                1],
  [32, "G58", "45 dakika + 30 dakika = kac saat kac dakika?",                                  ["1 saat 5 dk","1 saat 15 dk","1 saat 20 dk","1 saat 25 dk"], 1],
  [33, "G58", "Bir oruntude: 5, 10, 20, 40, ... Sonraki sayi kactir?",                         ["60","70","80","90"],                                    2],
  [34, "G58", "Bir ucgenin acilari 60 ve 80 derecedir. Ucuncu aci kac derecedir?",              ["30","40","50","60"],                                    1],
  [35, "G58", "1 kg 250 g = kac gram?",                                                        ["1025","1150","1250","1350"],                            2],

  // ── G59 (poolId 36-50) ────────────────────────────────────────────────────
  [36, "G59", "Markette 3 elma 6 TL, 5 armut 15 TL ise hangi meyve daha pahalidir?",                    ["Elma","Armut","Esit","Hesaplanamaz"],   1],
  [37, "G59", "Bir trenin 4 vagonu var. Her vagonda 36 koltuk. Toplam 20 bos koltuk varsa dolu koltuk?", ["114","124","134","144"],                1],
  [38, "G59", "Bir haritada 1 cm = 10 km'yi temsil ediyor. 45 km'lik yol haritada kac cm'dir?",          ["3,5","4","4,5","5"],                   2],
  [39, "G59", "Zeynep ayda 150 TL harcilik aliyor. Yilda ne kadar harcilik alir?",                        ["1500","1700","1800","2000"],            2],
  [40, "G59", "Bir sinifta 30 ogrencinin 12'si gozluk takiyor. Gozluk takmayanlar kac kisidir?",         ["15","16","17","18"],                   3],
  [41, "G59", "5 kisilik aile 3 gunde 6 ekmek tuketiyor. 5 gunde kac ekmek tuketir?",                   ["8","9","10","11"],                     2],
  [42, "G59", "Bir magazada mont yuzde 20 indirimle 240 TL'ye satiliyor. Indirimsiz fiyati kac TL?",     ["270","280","290","300"],               3],
  [43, "G59", "Bir kutuphanede 400 kitabin 160'i roman. Romanlarin yuzdesi kac?",                        ["30","35","40","45"],                   2],
  [44, "G59", "Mehmet 1 haftada 3 kitap okuyor. 4 haftada kac kitap okur?",                              ["9","10","11","12"],                    3],
  [45, "G59", "Bir bahcenin alani 48 m2'dir. Genisligi 6 m ise uzunlugu kac metredir?",                  ["6","7","8","9"],                       2],
  [46, "G59", "250 g findik 50 TL ise 1 kg findik kac TL'dir?",                                         ["150","175","200","225"],               2],
  [47, "G59", "Bir fabrika gunde 240 urun uretiyor. 7 gunde kac urun uretiyor?",                         ["1440","1560","1680","1800"],           2],
  [48, "G59", "Ayse'nin 5 gunde okudugu sayfa sayisi 75'tir. Gunde ortalama kac sayfa okur?",            ["13","14","15","16"],                   2],
  [49, "G59", "3 isci bir isi 12 gunde bitiriyor. 6 isci ayni isi kac gunde bitirir?",                  ["4","5","6","7"],                       2],
  [50, "G59", "2 kalem ve 3 defter 24 TL. 1 kalem 3 TL ise 1 defter kac TL?",                           ["4","5","6","7"],                       2],
]

const GRADE4_QUESTIONS: QDef[] = [
  // ── G57 (poolId 1-20) ─────────────────────────────────────────────────────
  [1,  "G57", "1234 + 5678 kactir?",                                                      ["6892","6902","6912","6922"], 2],
  [2,  "G57", "8743 - 2568 kactir?",                                                      ["6155","6165","6175","6185"], 2],
  [3,  "G57", "23 x 34 kactir?",                                                          ["762","772","782","792"],     2],
  [4,  "G57", "252 / 14 kactir?",                                                         ["16","17","18","19"],         2],
  [5,  "G57", "Bir sayinin 5 kati 175'tir. Bu sayi kactir?",                               ["30","32","35","40"],         2],
  [6,  "G57", "3750 + 1250 kactir?",                                                      ["4900","4950","5000","5050"], 2],
  [7,  "G57", "10000 - 3478 kactir?",                                                     ["6502","6512","6522","6532"], 2],
  [8,  "G57", "45 x 16 kactir?",                                                          ["700","710","720","730"],     2],
  [9,  "G57", "480 / 16 kactir?",                                                         ["24","27","30","33"],         2],
  [10, "G57", "Bir fabrika gunde 125 urun uretiyor. 8 gunde kac urun uretir?",             ["900","950","1000","1050"],   2],
  [11, "G57", "2468 + 3579 kactir?",                                                      ["6027","6037","6047","6057"], 2],
  [12, "G57", "9000 - 3456 kactir?",                                                      ["5524","5534","5544","5554"], 2],
  [13, "G57", "28 x 35 kactir?",                                                          ["960","970","980","990"],     2],
  [14, "G57", "504 / 18 kactir?",                                                         ["24","26","28","30"],         2],
  [15, "G57", "Bir kutuphanede her rafta 45 kitap var. 12 raf toplam kac kitap barindiriyor?", ["520","530","540","550"], 2],
  [16, "G57", "1875 + 2625 kactir?",                                                      ["4400","4450","4500","4550"], 2],
  [17, "G57", "7500 - 2875 kactir?",                                                      ["4605","4615","4625","4635"], 2],
  [18, "G57", "35 x 24 kactir?",                                                          ["820","830","840","850"],     2],
  [19, "G57", "630 / 21 kactir?",                                                         ["24","27","30","33"],         2],
  [20, "G57", "Zeynep her gun 24 soru cozuyor. 15 gunde kac soru cozer?",                 ["340","350","360","370"],     2],

  // ── G58 (poolId 21-35) ────────────────────────────────────────────────────
  [21, "G58", "Bir dikdortgenin uzun kenari 15 cm, kisa kenari 8 cm. Alani kac cm2?",         ["100","110","120","130"],                                     2],
  [22, "G58", "Saat 14:30'da baslayan toplanti 1 saat 45 dakika surer. Kacta biter?",         ["15:45","16:00","16:15","16:30"],                             2],
  [23, "G58", "5 hafta kac gundur?",                                                          ["25","30","35","40"],                                        2],
  [24, "G58", "Bir ucgenin iki acisi 75 ve 55 derecedir. Ucuncu aci kac derecedir?",           ["40","50","60","70"],                                        1],
  [25, "G58", "Bir karenin cevresi 48 cm'dir. Bir kenari kac cm'dir?",                        ["10","11","12","13"],                                        2],
  [26, "G58", "Oruntu: 3, 6, 12, 24, 48, ... Sonraki sayi kactir?",                          ["72","84","96","108"],                                       2],
  [27, "G58", "3 saat 30 dakika kac dakikadir?",                                              ["180","190","200","210"],                                    3],
  [28, "G58", "Bir sayinin 2/3'u 18'dir. Sayinin tamami kactir?",                             ["21","24","27","30"],                                        2],
  [29, "G58", "Oruntu: 1, 4, 9, 16, 25, ... Sonraki sayi kactir?",                           ["30","32","36","38"],                                        2],
  [30, "G58", "Bir besgenin toplam ic acisi kac derecedir?",                                   ["360","450","540","630"],                                    2],
  [31, "G58", "2 saat 15 dakika + 3 saat 40 dakika = ?",                                     ["5 saat 45 dk","5 saat 55 dk","6 saat 5 dk","6 saat 15 dk"], 1],
  [32, "G58", "Oruntu: 2, 5, 11, 23, ... Sonraki sayi kactir?",                              ["44","45","46","47"],                                        3],
  [33, "G58", "Bir dikdortgenin cevresi 54 cm. Uzun kenari 16 cm ise kisa kenari kac cm?",    ["9","10","11","12"],                                         2],
  [34, "G58", "4 kg 250 g = kac gram?",                                                      ["4025","4125","4250","4525"],                                2],
  [35, "G58", "2500 ml = kac litre kac mililitre?",                                           ["2 L 500 ml","2 L 250 ml","25 L","250 L"],                   0],

  // ── G59 (poolId 36-50) ────────────────────────────────────────────────────
  [36, "G59", "4 paket biskuvi 32 TL, 6 paket cips 48 TL. Hangi urun daha pahalıdır?",           ["Biskuvi","Cips","Esit","Hesaplanamaz"],   2],
  [37, "G59", "6 vagonlu tren, vagonda 48 koltuk. Yolcular %75 dolu ise bos koltuk sayisi?",      ["60","68","72","80"],                     2],
  [38, "G59", "Haritada 2 cm = 50 km. 175 km'lik yol haritada kac cm'dir?",                       ["5","6","7","8"],                        2],
  [39, "G59", "Buse her hafta 75 TL biriktirir. 8 haftada ne kadar biriktirir?",                  ["550","575","600","625"],                 2],
  [40, "G59", "Bir sinifta 32 ogrencinin 12'si gozluk takiyor. Gozluk takanlarin orani kactir?",  ["3/10","3/8","1/4","1/3"],                1],
  [41, "G59", "6 isci bir duvari 4 gunde boyuyor. 8 isci ayni duvari kac gunde boyar?",           ["2","3","4","5"],                        1],
  [42, "G59", "Urune once %25 zam sonra %20 indirim yapildi. Baslangic 100 TL ise son fiyat?",    ["95 TL","100 TL","105 TL","110 TL"],      1],
  [43, "G59", "Bir okulda 500 ogrencinin 200'u kiz. Erkek ogrencilerin yuzdesi kactir?",          ["%40","%50","%60","%70"],                 2],
  [44, "G59", "Ahmet her gun 1,5 saatte 30 matematik sorusu cozuyor. 4 gunde kac soru cozer?",    ["100","110","120","130"],                 2],
  [45, "G59", "Dikdortgen tarlinin uzunlugu 24 m, genisligi 18 m. Cevresi kac m?",                ["76","80","84","88"],                    2],
  [46, "G59", "500 g ceviz 80 TL ise 750 g kac TL'dir?",                                         ["100","110","120","130"],                 2],
  [47, "G59", "Bir depo 350 kutu doluydu. Her gun 25 kutu cikariildi. 6. gunun sonunda kac kutu?",["190","195","200","205"],                 2],
  [48, "G59", "Elif gunluk 1250 adim yuruyor. Haftada kac adim atar?",                           ["8500","8600","8700","8750"],             3],
  [49, "G59", "4 muslugun ayni anda bir havuzu doldurma suresi 6 saat. 8 muslukla kac saat?",     ["2","3","4","5"],                        1],
  [50, "G59", "4 kalem ve 5 silgi 35 TL. 1 silgi 3 TL ise 1 kalem kac TL?",                      ["4","5","6","7"],                        1],
]

// ─── SINAV OLUSTURMA ──────────────────────────────────────────────────────────

type QInfo = { id: string; correctAnswer: number; optCount: number }
type QMap  = Map<number, Map<number, QInfo>> // grade → poolId → QInfo

async function createExamForStudent(
  studentId: string,
  grade: number,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  qMap: QMap,
) {
  const gq = qMap.get(grade)
  if (!gq || gq.size === 0) return

  const startedAt = status !== "PENDING" ? pastDate(ri(2, 120)) : null
  const endedAt   = status === "COMPLETED"
    ? new Date(startedAt!.getTime() + ri(18, 55) * 60_000)
    : null

  const exam = await prisma.exam.create({
    data: { studentId, grade, status, startedAt, endedAt },
  })

  const answers: { examId: string; questionId: string; selected: number; isCorrect: boolean }[] = []

  if (status === "PENDING") {
    for (const [, q] of gq) {
      answers.push({ examId: exam.id, questionId: q.id, selected: -1, isCorrect: false })
    }
  } else if (status === "IN_PROGRESS") {
    const answeredUpTo = ri(8, 30)
    for (const [poolId, q] of gq) {
      if (poolId <= answeredUpTo) {
        const isCorrect = Math.random() < 0.55
        answers.push({
          examId: exam.id,
          questionId: q.id,
          selected: isCorrect ? q.correctAnswer : wrongAnswer(q.correctAnswer, q.optCount),
          isCorrect,
        })
      } else {
        answers.push({ examId: exam.id, questionId: q.id, selected: -1, isCorrect: false })
      }
    }
  } else {
    // COMPLETED: rastgele dogru sayilari belirle, skoru geriye hesapla
    const g57c = ri(4, 20)
    const g58c = ri(3, 15)
    const g59c = ri(3, 15)

    const G57 = Math.round((g57c / 20) * 1000) / 10
    const G58 = Math.round((g58c / 15) * 1000) / 10
    const G59 = Math.round((g59c / 15) * 1000) / 10
    const G76 = Math.round((G57 * 0.4 + G58 * 0.3 + G59 * 0.3) * 10) / 10
    const level = calcLevel(G76)

    let g57rem = g57c, g57tot = 0
    let g58rem = g58c, g58tot = 0
    let g59rem = g59c, g59tot = 0

    for (const [poolId, q] of gq) {
      let isCorrect: boolean

      if (poolId <= 20) {
        g57tot++
        const left = 20 - g57tot
        isCorrect = (g57rem > left) || (g57rem > 0 && Math.random() < g57rem / (left + 1))
        if (isCorrect && g57rem > 0) g57rem--
      } else if (poolId <= 35) {
        g58tot++
        const left = 15 - g58tot
        isCorrect = (g58rem > left) || (g58rem > 0 && Math.random() < g58rem / (left + 1))
        if (isCorrect && g58rem > 0) g58rem--
      } else {
        g59tot++
        const left = 15 - g59tot
        isCorrect = (g59rem > left) || (g59rem > 0 && Math.random() < g59rem / (left + 1))
        if (isCorrect && g59rem > 0) g59rem--
      }

      answers.push({
        examId: exam.id,
        questionId: q.id,
        selected: isCorrect ? q.correctAnswer : wrongAnswer(q.correctAnswer, q.optCount),
        isCorrect,
      })
    }

    await prisma.examResult.create({
      data: { examId: exam.id, G57, G58, G59, G76, level },
    })
  }

  await prisma.examAnswer.createMany({ data: answers })
}

// ─── OKUL YAPISI ──────────────────────────────────────────────────────────────

const SCHOOLS_DEF = [
  {
    name: "Barbaros Ilkokulu", city: "Mersin", phone: "03240001111",
    adminEmail: "okul@matroskop.com", adminName: "Ahmet Yilmaz",
    teachers: [
      { email: "ogretmen@matroskop.com",  name: "Fatma Demir",   classes: [{ name: "3-A", grade: 3, count: 8 }, { name: "3-B", grade: 3, count: 8 }] },
      { email: "ogretmen2@matroskop.com", name: "Kemal Arslan",  classes: [{ name: "4-A", grade: 4, count: 8 }, { name: "4-B", grade: 4, count: 8 }] },
    ],
  },
  {
    name: "Ataturk Ilkokulu", city: "Ankara", phone: "03120002222",
    adminEmail: "okul2@matroskop.com", adminName: "Sevim Kara",
    teachers: [
      { email: "ogretmen3@matroskop.com", name: "Huseyin Sahin", classes: [{ name: "3-A", grade: 3, count: 9 }, { name: "3-B", grade: 3, count: 9 }] },
      { email: "ogretmen4@matroskop.com", name: "Gulcan Yildiz", classes: [{ name: "4-A", grade: 4, count: 9 }, { name: "4-B", grade: 4, count: 9 }] },
    ],
  },
  {
    name: "Cumhuriyet Ilkokulu", city: "Izmir", phone: "02320003333",
    adminEmail: "okul3@matroskop.com", adminName: "Nuri Dogan",
    teachers: [
      { email: "ogretmen5@matroskop.com", name: "Asli Celik",   classes: [{ name: "3-A", grade: 3, count: 10 }, { name: "3-B", grade: 3, count: 10 }] },
      { email: "ogretmen6@matroskop.com", name: "Bulent Koc",   classes: [{ name: "4-A", grade: 4, count: 10 }, { name: "4-B", grade: 4, count: 10 }] },
    ],
  },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seed basliyor...")

  // ── TEMİZLİK ─────────────────────────────────────────────────────────────
  await prisma.studentSupplier.deleteMany()
  await prisma.examResult.deleteMany()
  await prisma.examAnswer.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.transfer.deleteMany()
  await prisma.student.deleteMany()
  await prisma.classroom.deleteMany()
  await prisma.user.deleteMany()
  await prisma.question.deleteMany()
  await prisma.school.deleteMany()
  await prisma.supplier.deleteMany()
  console.log("  ✓ Veritabani temizlendi")

  const hash = await bcrypt.hash("Matroskop123!", 12)

  // ── SORULAR ───────────────────────────────────────────────────────────────
  for (const [poolId, category, content, options, correctAnswer] of GRADE3_QUESTIONS) {
    await prisma.question.create({ data: { poolId, category, content, options, correctAnswer, grade: 3, isActive: true } })
  }
  for (const [poolId, category, content, options, correctAnswer] of GRADE4_QUESTIONS) {
    await prisma.question.create({ data: { poolId, category, content, options, correctAnswer, grade: 4, isActive: true } })
  }
  console.log("  ✓ 100 soru olusturuldu (3. sinif + 4. sinif, pool 1-50)")

  // Soru haritasi olustur: grade → poolId → { id, correctAnswer, optCount }
  const allQs = await prisma.question.findMany({ select: { id: true, grade: true, poolId: true, correctAnswer: true, options: true } })
  const qMap: QMap = new Map()
  for (const q of allQs) {
    if (!qMap.has(q.grade)) qMap.set(q.grade, new Map())
    qMap.get(q.grade)!.set(q.poolId, { id: q.id, correctAnswer: q.correctAnswer, optCount: q.options.length })
  }

  // ── SİSTEM YÖNETİCİSİ ────────────────────────────────────────────────────
  await prisma.user.create({
    data: { email: "sistem@matroskop.com", password: hash, name: "Sistem Yoneticisi", role: "SYSTEM_ADMIN" },
  })
  console.log("  ✓ Sistem yoneticisi olusturuldu")

  // ── TEDARİKÇİLER ─────────────────────────────────────────────────────────
  const supplier1 = await prisma.supplier.create({
    data: { name: "Mersin Matematik Akademisi", phone: "05070001111", address: "Yenisehir, Mersin", isActive: true },
  })
  await prisma.user.create({
    data: { email: "tedarikci@matroskop.com", password: hash, name: "Erhan Salva", role: "SUPPLIER", supplierId: supplier1.id },
  })

  const supplier2 = await prisma.supplier.create({
    data: { name: "Ankara Dersane ve Etut Merkezi", phone: "05320002222", address: "Cankaya, Ankara", isActive: true },
  })
  await prisma.user.create({
    data: { email: "tedarikci2@matroskop.com", password: hash, name: "Leyla Arslan", role: "SUPPLIER", supplierId: supplier2.id },
  })
  console.log("  ✓ 2 tedarikci + 2 tedarikci kullanicisi olusturuldu")

  // ── OKULLAR, OGRETMENLER, SINIFLAR, OGRENCILER ───────────────────────────
  let totalStudents = 0
  let completedCount = 0, inProgressCount = 0, pendingCount = 0

  // Tedarikci atamasi icin ogrenci havuzu
  const supplier1Students: string[] = []
  const supplier2Students: string[] = []

  let schoolIndex = 1
  for (const schoolDef of SCHOOLS_DEF) {
    const school = await prisma.school.create({
      data: { name: schoolDef.name, city: schoolDef.city, phone: schoolDef.phone, isActive: true },
    })
    await prisma.user.create({
      data: { email: schoolDef.adminEmail, password: hash, name: schoolDef.adminName, role: "SCHOOL_ADMIN", schoolId: school.id },
    })

    let teacherIndex = 1
    for (const tDef of schoolDef.teachers) {
      const teacherUser = await prisma.user.create({
        data: { email: tDef.email, password: hash, name: tDef.name, role: "TEACHER", schoolId: school.id },
      })

      let classIndex = 1
      for (const cDef of tDef.classes) {
        const suffix = `${cDef.grade}${classIndex === 1 ? "a" : "b"}${schoolIndex}`
        const classroom = await prisma.classroom.create({
          data: { name: cDef.name, grade: cDef.grade, schoolId: school.id, teacherId: teacherUser.id },
        })

        for (let i = 0; i < cDef.count; i++) {
          const { name: fullName, first, last } = genName()
          const username = makeUsername(first, last, suffix)

          const userRecord = await prisma.user.create({
            data: { username, password: hash, name: fullName, role: "STUDENT", schoolId: school.id },
          })
          const studentRecord = await prisma.student.create({
            data: { userId: userRecord.id, schoolId: school.id, classroomId: classroom.id },
          })

          // Sinav durumu dagitimi: %70 COMPLETED, %20 IN_PROGRESS, %10 PENDING
          const roll = Math.random()
          let examStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
          if (roll < 0.10)      { examStatus = "PENDING";     pendingCount++    }
          else if (roll < 0.30) { examStatus = "IN_PROGRESS"; inProgressCount++ }
          else                  { examStatus = "COMPLETED";   completedCount++  }

          await createExamForStudent(studentRecord.id, cDef.grade, examStatus, qMap)

          // Tedarikci havuzuna ekle (~%30 ogrenci tedarikci 1 veya 2'ye atanacak)
          const assignRoll = Math.random()
          if (assignRoll < 0.18) supplier1Students.push(studentRecord.id)
          else if (assignRoll < 0.30) supplier2Students.push(studentRecord.id)

          totalStudents++
        }
        classIndex++
      }
      teacherIndex++
    }
    console.log(`  ✓ ${schoolDef.name} olusturuldu`)
    schoolIndex++
  }

  // ── TEDARİKÇİ ATAMALARI ──────────────────────────────────────────────────
  for (const sid of supplier1Students) {
    await prisma.studentSupplier.create({ data: { studentId: sid, supplierId: supplier1.id, isActive: true } })
  }
  for (const sid of supplier2Students) {
    await prisma.studentSupplier.create({ data: { studentId: sid, supplierId: supplier2.id, isActive: true } })
  }
  console.log(`  ✓ ${supplier1Students.length} ogrenci Tedarikci 1'e, ${supplier2Students.length} ogrenci Tedarikci 2'ye atandi`)

  // ── ÖZET ─────────────────────────────────────────────────────────────────
  console.log()
  console.log("═══════════════════════════════════════════════")
  console.log("  SEED TAMAMLANDI")
  console.log("═══════════════════════════════════════════════")
  console.log(`  Okullar   : 3`)
  console.log(`  Ogretmenler: 6`)
  console.log(`  Siniflar  : 12`)
  console.log(`  Ogrenciler: ${totalStudents}`)
  console.log(`    Tamamlanmis sinav  : ${completedCount}`)
  console.log(`    Devam eden sinav   : ${inProgressCount}`)
  console.log(`    Bekleyen sinav     : ${pendingCount}`)
  console.log()
  console.log("  Test hesaplari (sifre: Matroskop123!):")
  console.log("    sistem@matroskop.com    → Sistem Yoneticisi")
  console.log("    okul@matroskop.com      → Okul Yoneticisi (Barbaros, Mersin)")
  console.log("    okul2@matroskop.com     → Okul Yoneticisi (Ataturk, Ankara)")
  console.log("    okul3@matroskop.com     → Okul Yoneticisi (Cumhuriyet, Izmir)")
  console.log("    ogretmen@matroskop.com  → Ogretmen (Barbaros, 3-A/3-B)")
  console.log("    ogretmen2@matroskop.com → Ogretmen (Barbaros, 4-A/4-B)")
  console.log("    tedarikci@matroskop.com → Tedarikci (Mersin Matematik Akademisi)")
  console.log("    tedarikci2@matroskop.com → Tedarikci (Ankara Dersane)")
  console.log("═══════════════════════════════════════════════")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
