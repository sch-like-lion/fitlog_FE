import Bucket from "@/components/ExercisePage/BucketPage/Bucket.jsx";

export async function generateStaticParams() {
  return [
    {type : 'ex-stat'},
    {type : 'select'}
  ]
}

export default function BucketPage({ params }) {
  const { type } = params;
  return <Bucket type={type} />;
} 