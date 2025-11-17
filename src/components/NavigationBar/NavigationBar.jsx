"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/home") {
      // 홈의 경우 /home 또는 / (루트)에서 활성화
      return pathname === "/home" || pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path) => {
    const baseClass = "flex flex-col items-center py-2 px-3 transition-colors";
    const activeClass = "text-orange-500 font-semibold";
    const inactiveClass = "text-gray-600 hover:text-orange-500";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href={"/callender"} className={getLinkClassName("/callender")}>
          <span className="material-icons text-xl mb-1">calendar_today</span>
          <span className="text-xs">달력</span>
        </Link>
        <Link href={"/exercise"} className={getLinkClassName("/exercise")}>
          <span className="material-icons text-xl mb-1">fitness_center</span>
          <span className="text-xs">운동</span>
        </Link>
        <Link href={"/home"} className={getLinkClassName("/home")}>
          <span className="material-icons text-xl mb-1">home</span>
          <span className="text-xs">홈</span>
        </Link>
        <Link href={"/ranking"} className={getLinkClassName("/ranking")}>
          <span className="material-icons text-xl mb-1">emoji_events</span>
          <span className="text-xs">랭킹</span>
        </Link>
        <Link href={"/settings"} className={getLinkClassName("/settings")}>
          <span className="material-icons text-xl mb-1">settings</span>
          <span className="text-xs">설정</span>
        </Link>
        {/* <Link href={"/shop"} className={getLinkClassName("/shop")}>
          <span className="material-icons text-xl mb-1">person</span>
          <span className="text-xs">상점</span>
        </Link> */}
      </div>
    </nav>
  );
}