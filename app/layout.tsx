import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAP — 선수와 나 사이의 차이",
  description: "나이를 넣으면 같은 나이에 선수가 해낸 일과 나 사이의 GAP을 보여주고, 오늘 운동할 이유를 드립니다.",
};

export const viewport: Viewport = {
  themeColor: "#111113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
