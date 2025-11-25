"use client";
import { useEffect, useState } from "react";
import { localStorageAPI } from "@/lib/axios";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Character from "@/components/HomePage/Character/Character";
import RankingIndicator from "@/components/HomePage/RankingIndicator/RankingIndicator";
import NickName from "@/components/HomePage/NickName/NickName";

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 토큰 확인
        // const token = localStorage.getItem('token');
        // console.log('Token exists:', !!token);
        // console.log('Token:', token);
        
        const response = await localStorageAPI.get('/api/rank');
        console.log('Response:', response);
        setUserData(response.data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <p>로딩 중...</p>
        </div>
        <NavigationBar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <p>데이터를 불러오는데 실패했습니다.</p>
        </div>
        <NavigationBar />
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <RankingIndicator data={userData} />
        <Character data={userData} />
        <NickName data={userData} />
      </div>
      <NavigationBar />
    </> 
  )
}