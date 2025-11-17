"use client";
import Bucket from "@/components/ExercisePage/BucketPage/Bucket.jsx";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// SearchParams를 사용하는 컴포넌트를 분리
function BucketContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  return (
    <div>
      <Bucket type={type} />
      <NavigationBar />
    </div>
  );
}

export default function BucketPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BucketContent />
    </Suspense>
  );
} 