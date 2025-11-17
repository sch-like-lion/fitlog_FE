// "use client";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Character from "@/components/HomePage/Character/Character";
import RankingIndicator from "@/components/HomePage/RankingIndicator/RankingIndicator";
import NickName from "@/components/HomePage/NickName/NickName";

export default function HomePage() {
  console.log('home 랜더링!!');

  return (
    <>
      {/* <h1 className="text-3xl font-bold">홈페이지</h1> */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <RankingIndicator />
        <Character />
        <NickName />
      </div>
      <NavigationBar />
    </> 
  )
}