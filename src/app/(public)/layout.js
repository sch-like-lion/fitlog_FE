"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    // 이미 로그인한 사용자는 홈으로
    if (token) {
      router.replace('/home');
    }
  }, [router]);

  return <>{children}</>;
}
