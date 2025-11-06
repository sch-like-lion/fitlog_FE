"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    console.log('router바뀜!!!');
    const token = localStorage.getItem("accessToken");
    // if (!token) {
    //   router.replace("/login");
    // }
  }, [router]);

  return <>{children}</>;
}