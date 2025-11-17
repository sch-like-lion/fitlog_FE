import Callender from "@/components/CallendarPage/Callender";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export default function CalendarPage() {
  console.log('캘린더page 랜더링!!');
  return (
    <div>
      <Callender />
      <NavigationBar />
    </div>
  )
}