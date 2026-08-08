import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "TutorIA Fisio",
  description: "Aprendizagem personalizada e baseada em evidências para Fisioterapia",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
