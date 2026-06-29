import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aprovação de Linha Editorial",
  description: "Sistema colaborativo de aprovação de conteúdos entre agência e cliente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen text-slate-900 antialiased">{children}</body>
    </html>
  );
}
