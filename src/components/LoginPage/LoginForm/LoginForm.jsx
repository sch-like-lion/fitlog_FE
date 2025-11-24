"use client";
import { useState } from "react";

import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import Link from "next/link";
// import AxiosTest from "./AxiosTest";
import { normalAPI } from "@/lib/axios";

export default function LoginForm() {
  const [id, setId] = useState("")
  const [pw, setPw] = useState("")
  const [errMessage, setErrMessage] = useState("")

  const loginRequest = async () => {
    try {
      const response = await normalAPI.post('/api/users/login', {
        customId : id,
        password : pw
      })

      // 로그인 성공시 토큰을 localStorage에 저장
      if (response.data && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        // 로그인한 사용자의 입력 id(customId)를 저장해 다른 컴포넌트에서 사용할 수 있도록 함
        // (추후에 백엔드가 userId 숫자를 반환하면 그 값을 저장하도록 변경 가능)
        localStorage.setItem('userId', id);
        console.log('로그인 성공:', response.data.message);
        // 로그인 성공시 홈페이지로 리다이렉트
        window.location.href = '/home';
      }
    } catch(err) {
      setErrMessage(err.message)
      console.error('로그인실패', err.message)
    }
  }

  const loginSubmitHandler = e => {
    e.preventDefault();
    console.log(id, pw);
    loginRequest() 
  };

  return (
    <>
      <form className="relative flex flex-col gap-2" onSubmit={loginSubmitHandler}>
        <Input value={id} onChange={e => setId(e.target.value)} type="text" placeholder="아이디" required={true} />
        <Input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="비밀번호" required={true} />
        <Button className={"bg-[#FF7A30]"}>로그인</Button>
        <span className="absolute bottom-[-25px] text-red-600 text-center w-full">{errMessage}</span>
      </form>
      <div className="flex justify-center gap-2 mt-4">
        <Link href={"/login/id-lost"} className="inline-block p-2 text-sm text-gray-500">아이디 찾기</Link>
        <Link href={"/login/pw-lost"} className="inline-block p-2 text-sm text-gray-500">비밀번호 찾기</Link>
        <Link href={"/signup"} className="inline-block p-2 text-sm text-gray-500">회원가입</Link>
      </div>
      {/* <AxiosTest/> */}
    </>
  );
}