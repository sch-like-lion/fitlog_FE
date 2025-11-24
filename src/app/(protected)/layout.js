"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 클라이언트 마운트 전까지는 로딩 표시
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">인증 확인 중...</div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전까지 빈 화면)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}