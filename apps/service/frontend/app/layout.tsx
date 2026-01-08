import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/lib/ThemeRegistry";
import { ToastProvider } from "@/components/common/Toast";

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
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
