"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 실행되는 영역
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      router.replace('/login');
    } else {
      router.replace('/home');
    }
    
    setIsLoading(false);
  }, [router]);

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return null;
}

/* 
export default function Home() {
  return (
    <>
      <h1>홈페이지</h1>
      <nav>
        <div><Link href={"/callender"}>달력</Link></div>
        <div><Link href={"/exercise"}>운동</Link></div>
        <div><Link href={"/"}>홈고민중</Link></div>
        <div><Link href={"/ranking"}>랭킹</Link></div>
        <div><Link href={"/settings"}>설정</Link></div>
      </nav>
    </>
  );
}
*/

/*
라우팅 설정 
- jwt없으면(로그아웃 상태라면)
/login
  /id-lost
    /이메일화면 토글 or 새 라우팅경로
  /pw-lost
    /비번 재설정화면 모달 or 새라우팅경로
/signup

- jwt있으면(로그인 상태라면)
/home
  nav
  /cal
  /exercise
    /bucket/recommend
    /bucket/custom
  /home
  /shop
  /ranking
  /setting
    /app-setting
    /profile-setting

  /partlist
    /:partlist
      /:partlist/:exerciselist
  
  /ex-stat (운동화면)
    들어온 운동종류, 횟수, 세트수 가있다면 그대로 진행
    아니라면, 사용자가 직접 추가
*/