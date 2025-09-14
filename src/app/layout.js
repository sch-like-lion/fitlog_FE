"use client";
import "./globals.css";  // 전체 앱에 적용되는 CSS

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tc-new-price">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </body>
    </html>
  );
}
