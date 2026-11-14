import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "그 나이에 걔는",
  description: "나이를 넣으면, 그 나이에 그 선수가 뭘 했는지 판독해 드립니다.",
};

export const viewport: Viewport = {
  themeColor: "#111113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        {/* 모든 화면은 가운데 402px 모바일 컬럼 안에 그린다 (docs/spec.md 10.4) */}
        <main className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-bg">
          {children}
        </main>
      </body>
    </html>
  );
}
