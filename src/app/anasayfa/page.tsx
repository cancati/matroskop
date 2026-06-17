'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Menu, X, Phone, Mail, MapPin, ArrowRight,
  Target, BarChart2, BookOpen, TrendingUp, Shield,
  ClipboardCheck, Plus, Star, Users, BookMarked,
  GraduationCap, Headphones, DollarSign, Handshake,
  CheckCircle,
} from 'lucide-react';

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Anasayfa',   href: '#giris' },
    { label: 'Matroskop',  href: '#matroskop' },
    { label: 'Hakkımızda', href: '#hakkimizda' },
    { label: 'Bayiler',    href: '#bayiler' },
    { label: 'İletişim',   href: '#iletisim' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[72px] flex items-center bg-white/90 backdrop-blur-md border-b border-surface-section">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12 flex items-center justify-between">
        <a href="#giris" className="flex items-center">
          <div className="relative h-10 w-40">
            <Image src="/images/matroskoplogo2.png" alt="Matroskop" fill className="object-contain object-left" />
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a key={label} href={href} className="text-[15px] font-medium text-brand/80 hover:text-brand transition-colors">
              {label}
            </a>
          ))}
        </div>

        <button className="hidden md:block border-2 border-brand text-brand rounded-full px-6 py-2 text-[14px] font-semibold hover:bg-brand hover:text-white transition-all">
          Giriş Yap
        </button>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="w-6 h-6 text-brand" /> : <Menu className="w-6 h-6 text-brand" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-section bg-white md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            {links.map(({ label, href }) => (
              <a key={label} href={href} className="text-sm font-medium text-brand/80" onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <button className="border-2 border-brand text-brand rounded-full py-2 text-sm font-semibold mt-2">
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const features = [
    { icon: Target,     label: 'PISA & TIMSS Standartlarında Ölçme' },
    { icon: BarChart2,  label: 'Bireysel Analiz ve Seviye Belirleme' },
    { icon: BookOpen,   label: 'Kişiselleştirilmiş Öğrenme Yolu' },
    { icon: TrendingUp, label: 'Sürekli Gelişim ve İzleme' },
    { icon: Shield,     label: 'Güvenli ve Bilimsel Veri Altyapısı' },
  ];

  return (
    <section id="giris" className="bg-surface min-h-[calc(100dvh-72px)] flex flex-col justify-center">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12 py-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Sol metin — 5 / 12 */}
          <div className="lg:col-span-5">
            <span className="bg-brand-light text-brand rounded-full px-4 py-1.5 text-[13px] font-semibold inline-block mb-6">
              PISA &amp; TIMSS Standartlarında Ölçme
            </span>

            <h1 className="text-[44px] lg:text-[66px] font-extrabold text-brand leading-none">
              Her Çocuk<br />
              Aynı Yerden<br />
              <span className="text-accent-yellow italic">&ldquo;Başlamaz.&rdquo;</span>
            </h1>

            <p className="text-[16px] lg:text-[17px] text-muted mt-5 max-w-md leading-relaxed">
              Matroskop bireysel ölçme sistemi, öğrencileri PISA ve TIMSS kriterlerine
              göre analiz eder. Her öğrenciye seviyesine uygun öğrenme yolu oluşturulur.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4">
              <button className="bg-brand text-white rounded-full px-8 py-4 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                Örnek Raporu İncele
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-surface-section text-brand rounded-full px-8 py-4 font-semibold hover:opacity-80 transition-opacity">
                Nasıl Çalışır?
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12px] lg:text-[13px] text-brand/80 font-medium">
                  <span className="bg-brand-light rounded-lg p-1.5 text-brand flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Sağ görsel + mockup — 7 / 12 */}
          <div className="lg:col-span-7 relative">

            {/* Fotoğraf — overflow-visible ki kartlar dışa taşabilsin */}
            <div className="relative w-full h-[400px] lg:h-[560px]">

              {/* Fotoğraf kırpma katmanı */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image src="/images/hero-child.png" alt="Öğrenci" fill className="object-cover object-center" />
              </div>

              {/* PISA badge — fotoğrafın sol üst sınırında */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden lg:flex absolute top-10 -left-5 z-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(3,49,71,0.18)] px-4 py-3 items-center gap-2.5"
              >
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="text-[10px] text-muted font-medium leading-none mb-0.5">Uluslararası Standart</div>
                  <div className="text-[13px] font-bold text-brand leading-none">PISA–TIMSS Onaylı</div>
                </div>
              </motion.div>

              {/* Rapor mockup — fotoğrafın sağ alt sınırında */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 0.4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="hidden lg:block absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-[0_16px_48px_rgba(3,49,71,0.2)] p-5 w-72 z-20"
              >
              <div className="text-[9px] font-bold text-muted uppercase tracking-wider mb-3">
                Matematiksel Beceri Raporu
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold text-brand">M.Tuna KANBAY</div>
                  <div className="text-[11px] text-muted">S/E · ÖZEL TOROS OKULLARI</div>
                </div>
                <span className="bg-brand-light text-brand rounded-lg px-2 py-0.5 text-[10px] font-semibold">
                  ID 17500325
                </span>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Ölçülen Alanlar</div>
                <div className="flex flex-col gap-2">
                  {[
                    { dot: 'bg-orange-400', label: 'Müfredat Temelli Beceriler',       score: '77', bg: 'bg-orange-100', color: 'text-orange-600' },
                    { dot: 'bg-green-400',  label: 'Uygulamalı Matematik Becerileri',  score: '54', bg: 'bg-green-100',  color: 'text-green-600'  },
                    { dot: 'bg-blue-400',   label: 'Matematik Okuryazarlığı',          score: '61', bg: 'bg-blue-100',   color: 'text-blue-600'   },
                  ].map(({ dot, label, score, bg, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                        <span className="text-[11px] text-brand/80">{label}</span>
                      </div>
                      <span className={`${bg} ${color} rounded-lg px-2 py-0.5 text-[11px] font-bold`}>{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-orange-400 leading-none">B1</span>
                  </div>
                  <span className="text-[9px] text-muted leading-none">Orta Seviye</span>
                </div>
                <p className="text-[10px] text-muted leading-relaxed">
                  Değerlendirmeler 100 Gösterenden yapılmıştır.
                </p>
              </div>
            </motion.div>

            </div>{/* /fotoğraf relative wrapper */}
          </div>{/* /col-span-7 */}

        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="bg-[#0d1f2d] py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-white/20">
          {[
            { value: '500+', label: 'Kayıtlı Kurum' },
            { value: '10K+', label: 'Test Uygulanan Öğrenci' },
            { value: '6',    label: 'Seviye Kademesi (A1–C2)' },
          ].map((stat, i) => (
            <div key={stat.value} className={`text-center ${i > 0 ? 'sm:pl-16' : ''} ${i < 2 ? 'sm:pr-16' : ''}`}>
              <div className="text-4xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LEARNING FRAMEWORK ──────────────────────────────────────────────────────
function LearningFramework() {
  const skills = [
    { label: 'Problem Çözme',             percent: 85, color: 'bg-brand' },
    { label: 'Matematik Okuryazarlığı',   percent: 72, color: 'bg-accent-yellow' },
    { label: 'Mantıksal Düşünme',         percent: 80, color: 'bg-accent-green' },
    { label: 'Veri Analizi',              percent: 70, color: 'bg-accent-blue' },
  ];

  return (
    <section id="matroskop" className="bg-surface min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Sol metin — 5 / 12 */}
          <div className="lg:col-span-5">
            <h2 className="text-[36px] lg:text-[52px] font-bold text-brand leading-tight">
              Matroskop<br />Öğrenme Modeli
            </h2>
            <div className="w-16 h-1 bg-accent-yellow rounded mt-3 mb-6" />

            <p className="text-muted text-[16px] lg:text-[17px] leading-relaxed">
              Matroskop öğretim programı, öğrencinin seviyesine göre kişiselleştirilmiş
              öğrenme rotası oluşturur. PISA ve TIMSS temelli modern içerikler sayesinde
              öğrenciler adım adım gelişim gösterir.
            </p>

            <div className="mt-8 flex flex-col gap-1">
              <span className="text-[28px] lg:text-[36px] font-bold text-brand block leading-tight">Ölçüyoruz.</span>
              <span className="text-[28px] lg:text-[36px] font-bold text-accent-yellow block leading-tight">Planlıyoruz.</span>
              <span className="text-[28px] lg:text-[36px] font-bold text-brand block leading-tight">Geliştiriyoruz.</span>
            </div>

            {/* Seviye rotası */}
            <div className="mt-10 bg-brand-light rounded-2xl p-5">
              <div className="text-[11px] font-bold text-brand/50 uppercase tracking-widest mb-4">Bireysel Öğrenme Rotası</div>
              <div className="flex items-start w-full">
                {[
                  { code: 'A1', label: 'Temel' },
                  { code: 'A2', label: 'Gelişiyor' },
                  { code: 'B1', label: 'Orta', active: true },
                  { code: 'B2', label: 'İleri' },
                  { code: 'C1', label: 'Yetkin' },
                  { code: 'C2', label: 'Uzman' },
                ].map((lvl, i) => (
                  <div key={lvl.code} className={`flex flex-col items-center ${i < 5 ? 'flex-1' : ''}`}>
                    <div className="flex items-center w-full">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                        lvl.active
                          ? 'bg-brand text-white shadow-[0_4px_12px_rgba(3,49,71,0.3)]'
                          : 'bg-white border-2 border-brand/15 text-brand/50'
                      }`}>
                        {lvl.code}
                      </div>
                      {i < 5 && <div className="flex-1 h-[2px] bg-brand/10" />}
                    </div>
                    <span className="text-[9px] text-brand/40 mt-2 text-center">{lvl.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ görsel + dashboard — 7 / 12 */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full h-[400px] lg:h-[500px]">

              {/* Fotoğraf kırpma katmanı */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image src="/images/classroom.png" alt="Sınıf" fill className="object-cover" />
              </div>

              {/* Kart 1 — sol üst kenarda */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden lg:block absolute top-8 -left-16 z-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(3,49,71,0.18)] p-4 w-52"
              >
                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Haftalık Plan</div>
                <div className="text-[13px] font-bold text-brand mb-3">Kişisel Öğrenme Rotası</div>
                <div className="flex flex-col gap-2">
                  {['Konu Analizi', 'Hedef Belirleme', 'Soru Planı', 'Tekrar'].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-accent-green flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] text-brand font-black">✓</span>
                      </div>
                      <span className="text-[12px] text-brand/70 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Kart 2 — sağ alt kenarda */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 0.4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                className="hidden lg:block absolute -bottom-6 -right-16 z-20 bg-white rounded-2xl shadow-[0_16px_48px_rgba(3,49,71,0.2)] p-4 w-56"
              >
                <div className="text-[13px] font-semibold text-brand mb-3">Beceri Gelişimi</div>
                <div className="flex flex-col gap-3">
                  {skills.map(skill => (
                    <div key={skill.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-brand/80">{skill.label}</span>
                        <span className="text-muted font-semibold">%{skill.percent}</span>
                      </div>
                      <div className="h-1.5 bg-surface-section rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// ─── NASIL ÇALIŞIR ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', icon: ClipboardCheck, title: 'Testi Uygula',         desc: 'Çevrim içi veya Matroskop Noktasında sınava gir.',                        numColor: 'text-accent-yellow',   iconBg: 'bg-accent-yellow/40',   border: 'border-accent-yellow/30' },
    { num: '02', icon: BarChart2,      title: 'Raporu Gör',           desc: "A1'den C2'ye uzanan seviye sisteminde konumunu öğren.",                   numColor: 'text-accent-blue',     iconBg: 'bg-accent-blue/40',     border: 'border-accent-blue/30'   },
    { num: '03', icon: BookOpen,       title: 'Plan Al',              desc: 'Kişiselleştirilmiş öğrenme rotanı ve haftalık planını al.',               numColor: 'text-accent-green',    iconBg: 'bg-accent-green/40',    border: 'border-accent-green/30'  },
    { num: '04', icon: TrendingUp,     title: 'Gelişimini Takip Et',  desc: 'Sürekli ölçme ve değerlendirme ile ilerlemeni izle.',                    numColor: 'text-brand/30',        iconBg: 'bg-brand-light',        border: 'border-brand/15'         },
  ];

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="text-center">
          <span className="bg-brand-light text-brand rounded-full px-4 py-1.5 text-[13px] font-semibold inline-block mb-4">
            Süreç
          </span>
          <h2 className="text-[32px] lg:text-[48px] font-bold text-brand">Nasıl Çalışır?</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-12">
          {steps.map(({ num, icon: Icon, title, desc, numColor, iconBg, border }) => (
            <div key={num} className={`bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden border ${border}`}>
              <div className={`absolute -top-2 -left-1 text-8xl font-black z-0 select-none leading-none ${numColor}`}>
                {num}
              </div>
              <div className="relative z-10">
                <span className={`${iconBg} rounded-xl p-3 text-brand w-fit flex mb-4`}>
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-brand text-[18px]">{title}</h3>
                <p className="text-muted text-[14px] leading-relaxed mt-2">{desc}</p>
                <div className="mt-6 ml-auto w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-brand" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── VURGU İKİLİ KART ────────────────────────────────────────────────────────
function EmphasisCards() {
  return (
    <div className="pb-10 px-6 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-accent-green rounded-3xl p-8 lg:p-10 h-72 lg:h-80 flex justify-between items-center overflow-hidden">
            <div>
              <span className="bg-white/40 text-brand rounded-full px-3 py-1 text-[12px] font-medium inline-block">
                Bireysel Analiz
              </span>
              <h3 className="text-[28px] lg:text-[36px] font-bold text-brand mt-3 leading-tight">
                Güçlü Yönleri<br />Net Görün.
              </h3>
              <p className="text-brand/70 text-[13px] lg:text-[14px] mt-2 max-w-[200px]">
                Potansiyelin bütünsel analizi ve gelişim alanları.
              </p>
            </div>
            <div className="relative w-32 h-48 lg:w-40 lg:h-64 flex-shrink-0">
              <Image src="/images/emphasis-analysis.png" alt="Analiz" fill className="object-contain drop-shadow-xl" />
            </div>
          </div>

          <div className="bg-accent-yellow rounded-3xl p-8 lg:p-10 h-72 lg:h-80 flex justify-between items-center overflow-hidden">
            <div>
              <span className="bg-white/40 text-brand rounded-full px-3 py-1 text-[12px] font-medium inline-block">
                Kişiselleştirilmiş
              </span>
              <h3 className="text-[28px] lg:text-[36px] font-bold text-brand mt-3 leading-tight">
                Her Öğrenciye<br />Özel Program.
              </h3>
              <p className="text-brand/70 text-[13px] lg:text-[14px] mt-2 max-w-[200px]">
                Seviyeye uygun hedef odaklı kişisel gelişim planı.
              </p>
            </div>
            <div className="relative w-32 h-48 lg:w-40 lg:h-64 flex-shrink-0">
              <Image src="/images/emphasis-program.png" alt="Program" fill className="object-contain drop-shadow-xl" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── HAKKIMIZDA ──────────────────────────────────────────────────────────────
function About() {
  const features = [
    { icon: BarChart2,  title: 'PISA & TIMSS',           desc: 'Odaklı Eğitim' },
    { icon: Users,      title: 'Bireysel Gelişim',        desc: 'Odaklı Yaklaşım' },
    { icon: BookMarked, title: 'Öğrenme Çerçevesi',       desc: 'Yapılandırılmış program' },
    { icon: Star,       title: 'A1 → C2 Seviye Sistemi', desc: 'Kişisel gelişim rotası' },
  ];

  return (
    <section id="hakkimizda" className="bg-surface min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Sol fotoğraf — 5 / 12 */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[400px] lg:h-[560px] rounded-3xl overflow-hidden">
              <Image src="/images/student-studying.png" alt="Öğrenci çalışıyor" fill className="object-cover" />
            </div>
            <div className="absolute bottom-8 right-0 bg-white rounded-2xl shadow-xl p-4 flex gap-3 items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-[13px] font-semibold text-brand">PISA–TIMSS Onaylı</span>
            </div>
          </div>

          {/* Sağ metin — 7 / 12 */}
          <div className="lg:col-span-7">
            <span className="bg-brand-light text-brand rounded-full px-4 py-1.5 text-[13px] font-semibold inline-block mb-4">
              Hakkımızda
            </span>
            <h2 className="text-[32px] lg:text-[48px] font-bold text-brand leading-tight">
              Her Çocuğun Matematiği<br />
              <span className="text-accent-yellow italic">Farklıdır.</span>
            </h2>
            <p className="text-muted text-[16px] lg:text-[17px] mt-4 leading-relaxed">
              Matroskop bireysel ölçme sistemi, öğrencilerin problem çözme ve analitik
              düşünme becerilerini PISA &amp; TIMSS standartlarında değerlendirir.
              A1&apos;den C2&apos;ye uzanan kişisel gelişim rotası oluşturulur.
            </p>
            <p className="text-brand font-semibold text-[16px] lg:text-[18px] mt-3">
              Matroskop matematik öğretmez. Matematiği öğrenmesini sağlar.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 shadow-sm">
                  <Icon className="w-5 h-5 text-brand mb-2" />
                  <div className="font-bold text-brand text-[14px]">{title}</div>
                  <div className="text-muted text-sm mt-0.5">{desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              {[
                { value: '500+', label: 'Kayıtlı Kurum' },
                { value: '10K+', label: 'Test Uygulanan Öğrenci' },
              ].map(stat => (
                <div key={stat.value} className="bg-white rounded-2xl p-5 shadow-sm flex-1">
                  <div className="text-3xl font-black text-brand">{stat.value}</div>
                  <div className="text-muted text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── REFERANSLAR ─────────────────────────────────────────────────────────────
function Testimonials() {
  const items = [
    { quote: 'Matroskop sayesinde öğrencilerimizin matematik seviyelerini çok daha doğru analiz edebiliyoruz.', author: 'Murat Y.',    role: 'Okul Müdürü' },
    { quote: 'Bireyselleştirilmiş eğitim yaklaşımımıza ciddi katkı sağladı.',                                   author: 'Zehra A.',    role: 'Matematik Öğretmeni' },
    { quote: 'Gelişim programı öğrencilerin ilerlemesini çok daha planlı hale getirdi.',                        author: 'Levent K.',   role: 'Eğitim Koordinatörü' },
    { quote: 'Öğrencilerimizi yalnızca sınavlara değil, geleceğe hazırlıyoruz.',                                author: 'Ali Rıza G.', role: 'Eğitim Kurumu Yöneticisi' },
  ];

  return (
    <section className="bg-[#0d1f2d] min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="text-center mb-12">
          <span className="bg-white/10 text-white/60 rounded-full px-4 py-1.5 text-[13px] font-semibold inline-block mb-4">
            Kurumlar Ne Diyor?
          </span>
          <h2 className="text-[32px] lg:text-[48px] font-bold text-white">
            Eğitimcilerin{' '}
            <span className="text-accent-yellow italic">Yorumları</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-7">
              <div className="text-5xl font-black text-accent-yellow leading-none">&ldquo;</div>
              <p className="text-white/80 text-[15px] leading-relaxed mt-3">{item.quote}</p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="font-bold text-white text-[14px]">{item.author}</div>
                <div className="text-white/50 text-[12px]">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BAYİLER ─────────────────────────────────────────────────────────────────
function Dealers() {
  const features = [
    { icon: TrendingUp,    title: 'Güçlü Marka',    desc: 'Güvenilir ve hızla büyüyen eğitim markası' },
    { icon: Headphones,    title: 'Sürekli Destek',  desc: 'Eğitim, operasyon ve pazarlama desteği' },
    { icon: DollarSign,    title: 'Kazançlı Model',  desc: 'Birlikte büyüyen sürdürülebilir sistem' },
    { icon: GraduationCap, title: 'Modern Eğitim',   desc: 'PISA & TIMSS temelli güncel içerikler' },
  ];

  return (
    <section id="bayiler" className="bg-surface min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Sol — 7/12 */}
          <div className="lg:col-span-7">
            <span className="bg-brand-light text-brand rounded-full px-4 py-1.5 text-[13px] font-semibold inline-block mb-5">
              BİRLİKTE BÜYÜYORUZ
            </span>
            <h2 className="text-[32px] lg:text-[52px] font-bold text-brand leading-tight">
              Matroskop<br />Temsilcilikleri
              <br />
              <span className="text-accent-yellow">Türkiye&apos;nin Her Yerinde!</span>
            </h2>
            <p className="text-muted text-[16px] lg:text-[17px] mt-5 max-w-lg leading-relaxed">
              Matroskop ile güçlü bir eğitim markasının parçası olun,
              geleceğin matematik eğitiminde yerinizi alın.
            </p>

            <div className="mt-10 flex flex-col gap-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="bg-brand-light rounded-xl p-3 text-brand flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-bold text-brand text-[15px]">{title}</div>
                    <div className="text-muted text-[14px] mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — 5/12 iletişim kartı */}
          <div className="lg:col-span-5">
            <div className="bg-brand rounded-3xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-yellow rounded-full flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-5 h-5 text-brand" />
                </div>
                <div className="text-white font-bold text-[17px] leading-tight">
                  Temsilci Olmak<br />İster misiniz?
                </div>
              </div>

              <p className="text-white/60 text-[14px] leading-relaxed mb-8">
                Bölgenizdeki Matroskop temsilciliği için hemen iletişime geçin,
                detaylı bilgi ve başvuru için sizi arayalım.
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <a href="tel:+905324608033" className="flex items-center gap-3 group">
                  <span className="bg-white/10 rounded-xl p-2.5 flex-shrink-0 group-hover:bg-accent-yellow/20 transition-colors">
                    <Phone className="w-4 h-4 text-accent-yellow" />
                  </span>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Telefon</div>
                    <div className="text-accent-yellow font-black text-[20px] leading-none">0 532 460 80 33</div>
                  </div>
                </a>
                <a href="mailto:info@matroskop.com" className="flex items-center gap-3 group">
                  <span className="bg-white/10 rounded-xl p-2.5 flex-shrink-0 group-hover:bg-accent-yellow/20 transition-colors">
                    <Mail className="w-4 h-4 text-accent-yellow" />
                  </span>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">E-posta</div>
                    <div className="text-white font-semibold text-[15px]">info@matroskop.com</div>
                  </div>
                </a>
              </div>

              <a
                href="tel:+905324608033"
                className="block w-full bg-accent-yellow text-brand text-center font-bold rounded-2xl py-4 hover:opacity-90 transition-opacity"
              >
                Hemen Başvur →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── İLETİŞİM ────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="iletisim" className="bg-surface-section min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Sol */}
          <div>
            <h2 className="text-[32px] lg:text-[48px] font-bold text-brand leading-tight">Bize Ulaşın</h2>
            <p className="text-muted mt-3 mb-8 text-[16px] lg:text-[17px] leading-relaxed">
              Matroskop hakkında bilgi almak veya demo talep etmek için bize ulaşın.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: Phone,  bg: 'bg-accent-yellow/20', label: '+90 532 460 80 33',              href: 'tel:+905324608033' },
                { icon: Mail,   bg: 'bg-accent-blue/20',   label: 'info@matroskop.com',             href: 'mailto:info@matroskop.com' },
                { icon: MapPin, bg: 'bg-accent-green/20',  label: 'Aydınlıkevler Mah. Yenişehir/MERSİN', href: '' },
              ].map(({ icon: Icon, bg, label, href }) => {
                const Tag = href ? 'a' : 'div';
                return (
                  <Tag key={label} {...(href ? { href } : {})} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <span className={`${bg} rounded-xl p-3 flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-brand" />
                    </span>
                    <span className="text-brand font-medium">{label}</span>
                  </Tag>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/matroskop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white rounded-2xl px-5 py-3.5 shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
                </svg>
                <span className="text-brand font-medium text-[14px]">Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/matroskop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white rounded-2xl px-5 py-3.5 shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
                <span className="text-brand font-medium text-[14px]">Facebook</span>
              </a>
            </div>
          </div>

          {/* Sağ form */}
          <div className="bg-brand rounded-3xl p-8 lg:p-10">
            <h3 className="text-white text-xl font-bold mb-6">Mesaj Gönderin</h3>
            <div className="flex flex-col gap-4">
              {['Ad Soyad', 'E-posta', 'Konu'].map(placeholder => (
                <input
                  key={placeholder}
                  type="text"
                  placeholder={placeholder}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 w-full focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                />
              ))}
              <textarea
                rows={4}
                placeholder="Mesaj"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 w-full focus:outline-none focus:ring-2 focus:ring-accent-yellow resize-none"
              />
              <button className="bg-accent-yellow text-brand font-bold rounded-full w-full py-4 mt-2 hover:opacity-90 transition-opacity">
                Gönder →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── SSS ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { q: 'Hangi sınıfları kapsar?',        a: 'İlkokuldan 8. sınıfa kadar tüm öğrencileri kapsamaktadır.' },
    { q: 'Çevrim içi mi, yüz yüze mi?',    a: 'Her ikisi de mümkündür. Çevrim içi platform veya Matroskop Noktaları aracılığıyla uygulanabilir.' },
    { q: 'Rapor ne zaman hazır?',           a: 'Test tamamlandıktan kısa süre sonra dijital rapor hazır olur ve ilgili kişilere iletilir.' },
    { q: 'Tüm öğrencilere aynı test mi?',  a: 'Hayır. Her öğrenciye seviyesine göre kişiselleştirilmiş test uygulanır.' },
  ];

  return (
    <section className="bg-surface min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <h2 className="text-[32px] lg:text-[48px] font-bold text-brand text-center">
          Sıkça Sorulan Sorular
        </h2>
        <div className="max-w-2xl mx-auto mt-12">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 mb-3 shadow-sm cursor-pointer select-none"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand pr-4">{item.q}</span>
                {openIndex === i
                  ? <X className="w-5 h-5 text-accent-yellow flex-shrink-0" />
                  : <Plus className="w-5 h-5 text-accent-yellow flex-shrink-0" />
                }
              </div>
              {openIndex === i && (
                <p className="text-muted text-[15px] mt-3 leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-brand text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-black text-xl mb-3">Matroskop</div>
            <p className="text-white/70 text-[14px] leading-relaxed">
              Matematiği ölçer, geliştirir ve geleceğe hazırlar.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4">Kurumsal</div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Anasayfa',   href: '#giris' },
                { label: 'Matroskop',  href: '#matroskop' },
                { label: 'Hakkımızda', href: '#hakkimizda' },
                { label: 'Bayiler',    href: '#bayiler' },
                { label: 'İletişim',   href: '#iletisim' },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="text-white/70 hover:text-white transition-colors text-[14px]">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4">İletişim</div>
            <div className="flex flex-col gap-2 text-white/70 text-[14px]">
              <span>+90 532 460 80 33</span>
              <span>info@matroskop.com</span>
              <span>Aydınlıkevler Mah. Yenişehir/MERSİN</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-white/50">
          <span>© 2026 Matroskop</span>
          <div className="flex gap-4">
            <a href="/kvkk" className="hover:text-white transition-colors">KVKK</a>
            <a href="/cerez-politikasi" className="hover:text-white transition-colors">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AnasayfaPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <LearningFramework />
      <section id="nasil" className="bg-surface-section min-h-dvh flex flex-col justify-center">
        <HowItWorks />
        <EmphasisCards />
      </section>
      <About />
      <Testimonials />
      <Dealers />
      <Contact />
      <FAQ />
      <Footer />
    </>
  );
}
