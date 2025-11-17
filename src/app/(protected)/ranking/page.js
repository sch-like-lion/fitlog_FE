import Ranking from "@/components/RankingPage/Ranking";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export default function RankPage() {
  console.log('랭크page 랜더링!!');
  return (
    <div>
      <Ranking />
      <NavigationBar />
    </div>
  )
}
