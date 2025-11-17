"use client";
import Button from "@/components/common/Button/Button";

export default function SocialLoginButtons() {
  const handleSocialLogin = (socialName) => {
    const authUrl = `/oauth2/authorization/${socialName}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button onClick={() => handleSocialLogin('naver')}>Naver 로그인</Button>
      <Button onClick={() => handleSocialLogin('kakao')}>Kakao 로그인</Button>
      <Button onClick={() => handleSocialLogin('google')}>Google 로그인</Button>
      <Button onClick={() => handleSocialLogin('apple')}>Apple 로그인</Button>
    </div>
  );
}