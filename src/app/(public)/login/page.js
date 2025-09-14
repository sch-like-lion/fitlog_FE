import Link from "next/link"

import LoginForm from "@/components/LoginPage/LoginForm/LoginForm";
import SocialLoginButtons from "@/components/LoginPage/SocialLoginButtons/SocialLoginButtons";


export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold absolute left-6 top-6 mb-0">로그인</h2>
      <LoginForm />
      <SocialLoginButtons />
    </div>
  )
}