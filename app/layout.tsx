import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js Canlı Test Uygulaması",
  description: "Canlı ortam testi için hazırlanmış basit ve modern Next.js uygulaması",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className={`${montserrat.className} min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}

