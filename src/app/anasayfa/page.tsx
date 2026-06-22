'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Menu, X, Phone, Mail, MapPin,
  Target, BarChart2, BookOpen, TrendingUp, Shield,
  Plus,
  GraduationCap, Headphones, DollarSign, Handshake,
} from 'lucide-react';

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Anasayfa',   href: '#anasayfa' },
    { label: 'Matroskop',  href: '#matroskop' },
    { label: 'Akademiler', href: '#akademiler' },
    { label: 'Kurumlar',   href: '#kurumlar' },
    { label: 'İletişim',   href: '#iletisim' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[72px] flex items-center relative bg-white/90 backdrop-blur-md border-b border-surface-section">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12 flex items-center justify-between">
        <a href="#anasayfa" className="flex items-center">
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

        <a href="/giris" className="hidden md:block border-2 border-brand text-brand rounded-full px-6 py-2 text-[14px] font-semibold hover:bg-brand hover:text-white transition-all">
          Giriş Yap
        </a>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="w-6 h-6 text-brand" /> : <Menu className="w-6 h-6 text-brand" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-surface-section shadow-lg md:hidden z-50">
          <div className="flex flex-col gap-3 px-6 py-4">
            {links.map(({ label, href }) => (
              <a key={label} href={href} className="text-sm font-medium text-brand/80" onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a href="/giris" className="border-2 border-brand text-brand rounded-full py-2 text-sm font-semibold mt-2 text-center">
              Giriş Yap
            </a>
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
    <section id="anasayfa" className="bg-surface min-h-[calc(100dvh-72px)] flex flex-col relative">

      {/* Mobil arka plan — bulanık fotoğraf */}
      <div className="absolute inset-0 lg:hidden overflow-hidden">
        <Image src="/images/hero-child.png" alt="" fill className="object-cover object-center scale-110 blur-md" />
        <div className="absolute inset-0 bg-brand/70" />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-col justify-center flex-1">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-12 py-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Sol metin — 5/12 */}
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

            {/* Sağ görsel + mockup — 7/12 */}
            <div className="lg:col-span-7 relative">

            {/* Fotoğraf — overflow-visible ki kartlar dışa taşabilsin */}
            <div className="relative w-full h-[400px] lg:h-[560px]">

              {/* Fotoğraf kırpma katmanı */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image src="/images/hero-child.png" alt="Öğrenci" fill className="object-cover object-center" />
              </div>



            </div>{/* /fotoğraf relative wrapper */}
          </div>{/* /col-span-7 */}

          </div>{/* /grid */}
        </div>{/* /mx-auto */}
      </div>{/* /desktop layout */}

      {/* Mobil layout */}
      <div className="flex lg:hidden flex-col flex-1 relative z-10 px-6 py-8">
        <div>
          <span className="bg-white/20 text-white rounded-full px-3 py-1 text-[12px] font-semibold inline-block mb-5">
            PISA &amp; TIMSS Standartlarında Ölçme
          </span>
          <h1 className="text-[38px] font-extrabold text-white leading-tight">
            Her Çocuk<br />
            Aynı Yerden<br />
            <span className="text-accent-yellow italic">&ldquo;Başlamaz.&rdquo;</span>
          </h1>
          <p className="text-[15px] text-white/80 mt-4 leading-relaxed">
            Matroskop bireysel ölçme sistemi, öğrencileri PISA ve TIMSS kriterlerine
            göre analiz eder. Her öğrenciye seviyesine uygun öğrenme yolu oluşturulur.
          </p>
          <div className="mt-6 flex gap-6">
            {[
              { value: '500+', label: 'Kayıtlı Kurum' },
              { value: '10K+', label: 'Test Uygulanan Öğrenci' },
            ].map(stat => (
              <div key={stat.value}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-wrap gap-2 mb-4">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
              <Icon className="w-3 h-3 text-accent-yellow flex-shrink-0" />
              <span className="text-[11px] text-white/90 font-medium">{label}</span>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '400+',    label: 'Akademi' },
    { value: '350+',    label: 'Kurum' },
    { value: '90.000+', label: 'Tanıma Testi' },
    { value: '20.000+', label: 'Kayıtlı Öğrenci' },
  ];

  return (
    <section className="bg-[#0d1f2d] py-14">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        <div className="text-center mb-10">
          <h2 className="text-white text-[20px] font-semibold">Matroskop Ekosistemi</h2>
          <div className="w-10 h-[3px] bg-blue-400 rounded mx-auto mt-2" />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-0 sm:divide-x sm:divide-white/20">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col items-center ${i > 0 ? 'sm:pl-16' : ''} ${i < stats.length - 1 ? 'sm:pr-16' : ''}`}>
              <div className="text-[42px] font-black text-white leading-none">{stat.value}</div>
              <div className="w-8 h-[3px] bg-blue-400 rounded mt-2 mb-2" />
              <div className="text-[14px] text-white/60">{stat.label}</div>
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
    <section id="matroskop" className="bg-surface lg:min-h-dvh flex flex-col justify-center py-10">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

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

          {/* Sağ görsel + dashboard — 7 / 12, mobilde gizli */}
          <div className="hidden lg:block lg:col-span-7 relative">
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



// ─── REFERANSLAR ─────────────────────────────────────────────────────────────
interface TestimonialItem { id: string; quote: string; author: string; role: string; photoUrl: string | null }

function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/yorumlar')
      .then(r => r.json())
      .then(data => { setItems(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="bg-[#0d1f2d] lg:min-h-dvh flex flex-col justify-center py-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:rounded-3xl md:p-7 flex flex-col">
              <div className="text-3xl md:text-5xl font-black text-accent-yellow leading-none">&ldquo;</div>
              <p className="text-white/80 text-[12px] md:text-[15px] leading-relaxed mt-2 md:mt-3 flex-1">{item.quote}</p>
              <div className="mt-3 md:mt-6 pt-3 md:pt-4 border-t border-white/10 flex items-center gap-3">
                {item.photoUrl ? (
                  <Image src={item.photoUrl} alt={item.author} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-white/20" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {item.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-[12px] md:text-[14px]">{item.author}</div>
                  <div className="text-white/50 text-[11px] md:text-[12px]">{item.role}</div>
                </div>
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
    <section id="bayiler" className="bg-surface lg:min-h-dvh flex flex-col justify-center py-10">
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
    <section id="iletisim" className="bg-surface-section lg:min-h-dvh flex flex-col justify-center py-10">
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
    <section className="bg-surface py-16">
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
                { label: 'Anasayfa',   href: '#anasayfa' },
                { label: 'Matroskop',  href: '#matroskop' },
                { label: 'Akademiler', href: '#akademiler' },
                { label: 'Kurumlar',   href: '#kurumlar' },
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
      <Testimonials />
      <Dealers />
      <Contact />
      <FAQ />
      <Footer />
    </>
  );
}
