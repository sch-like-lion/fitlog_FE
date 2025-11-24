"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      router.replace('/login');
    } else {
      router.replace('/home');
    }
  }, [router]);

  return null;
}
