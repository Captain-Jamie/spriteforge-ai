import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpriteForge AI",
  description: "AI 2D game asset generation workbench"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
