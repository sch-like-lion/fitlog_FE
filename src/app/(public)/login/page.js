import Link from "next/link"

import LoginForm from "@/components/LoginPage/LoginForm/LoginForm";
import SocialLoginButtons from "@/components/LoginPage/SocialLoginButtons/SocialLoginButtons";


export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <SocialLoginButtons />
    </div>
  )
}