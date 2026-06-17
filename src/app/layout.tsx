import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matroskop - Matematik Eğitiminde Bilimsel Yaklaşım",
  description:
    "8. sınıfa kadar öğrencilerin matematik becerilerini çok yönlü değerlendiren, güvenilir ve kapsamlı test platformu.",
  openGraph: {
    title: "Matroskop",
    description:
      "Matematik eğitiminde bilimsel, güvenilir ve kişiselleştirilmiş yaklaşım.",
    url: "https://matroskop.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-surface text-brand antialiased">{children}</body>
    </html>
  );
}
