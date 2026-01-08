import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/lib/ThemeRegistry";

export const metadata: Metadata = {
  title: "FaMoney - 가족과 함께하는 투명한 가계부",
  description: "그룹 지출을 쉽고 투명하게 기록하고 관리하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
