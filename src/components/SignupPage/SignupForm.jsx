"use client"
import React, { useState } from 'react';
import Input from '@/components/common/Input/Input';
import Button from '../common/Button/Button';
export default function SignupForm() {
  const [name, setName] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [isEmailCodeEnabled, setIsEmailCodeEnabled] = useState(false);
  // 인증번호 입력창 활성화 비활성화를 결정하는 역할

  const [allAgree, setAllAgree] = useState(false);  // 모두 동의 체크박스체
  const [termsAgree, setTermsAgree] = useState({    // 각 세부 동의의 항목을 따로 관리
    age14: false,
    tos: false,
    privacy: false,
    privacyOption: false,
    adsOption: false,
  });

  const handleSendCode = () => {
    setIsEmailCodeEnabled(true);  // 이 함수 실행 시 isEmailCodeEnable가 true화 => 인증번호 입력창이 활성화됨
  };

  const handleAllAgree = (checked) => {
    setAllAgree(checked);
    setTermsAgree({
      age14: checked,
      tos: checked,
      privacy: checked,
      privacyOption: checked,
      adsOption: checked,
    });
  };
  const handleTermChange = (key, checked) => {
    const updated = { ...termsAgree, [key]: checked };
    setTermsAgree(updated);
    setAllAgree(Object.values(updated).every(v => v));
  };
  // 각 동의 항목의 체크 버튼이 눌릴 때마다 상태를 업데이트하고
  // 모든 항목이 체크되면 자동으로 [전체 동의]도 체크

  const handleSubmit = async (e) => {
  e.preventDefault();
  const body = {
    nickname: name,
    customId: userid,
    password,
    email,
    height: parseInt(height, 10),
    weight: parseInt(weight, 10),
    mailcheck: !!emailCode, // 인증번호 입력이 있으면 true, 없으면 false
  };

  try {
    const response = await fetch("http://fitlog.iubns.net:8080/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 201) {
      const data = await response.json();
      alert(data.message);
      // 가입 후 원하는 동작 (ex 페이지 이동)
    } else if (response.status === 400) {
      const error = await response.json();
      alert(error.message || Object.values(error)[0]);
    } else {
      alert("가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  } catch (err) {
    alert("네트워크 오류가 발생했습니다.");
    console.error(err);
  }
};


  return (
    <form 
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4 relative" 
      // 최대 너비를 중간 크기로, 좌우 마진 자동, 배경 하얗게, 내부 패딩 24px, 모서리 많이, 그림자 중간, 안에 있는 것들 y축이 각 16px씩 간격, 위치속성 realative
      onSubmit={handleSubmit} 
    >  
      <h2 className="text-2xl font-semibold absolute left-6 top-6 mb-0">회원가입</h2>
      <div className="pt-14" />

      <Input
        className="block w-full border p-2 rounded"
        placeholder="이름"
        value={name}
        onChange={e => setName(e.target.value)} // 입력시 onChange 발생, 사용자의 입력을 value값으로 set
      />
      <Input
        className="block w-full border p-2 rounded"
        placeholder="아이디"
        value={userid}
        onChange={e => setUserid(e.target.value)}
      />

      <Input
        type="password" // type을 password로 지정해 사용자에게 ●●●● 모양으로 보여줌
        className="block w-full border p-2 rounded"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)} 
        //TODO 비밀번호 유효성 검사 및 비밀번호 보이기 버튼 추가 해야함
      />

      <div className="flex space-x-2">
        <Input
          className="flex-1 border p-2 rounded"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button
          type="button"
          className="bg-gray-200 px-2 rounded text-sm text-white"
          onClick={handleSendCode}  // 클릭할 경우 인증번호 전송. 
        >
          인증번호 전송
        </Button>
      </div>

      <div className="flex space-x-2">
        <Input
          className={`flex-1 border p-2 rounded ${isEmailCodeEnabled ? '' : 'bg-gray-100'}`} 
          // isEmailCodeEnable가 true, 즉 인증번호 전송 클릭시 배경색 x, 아니라면 배경색 회색
          placeholder="인증번호"
          value={emailCode}
          onChange={e => setEmailCode(e.target.value)}
          disabled={!isEmailCodeEnabled}  
          // isEmailCodeEnabled가 false라면 이 속성이 true가 되어 입력창이 비활성화되고, 사용자가 입력 불가능
        />
        <Button type="button" className="bg-gray-200 px-2 rounded text-sm text-white">확인</Button>
      </div>

      <Input
        className="block w-full border p-2 rounded"
        placeholder="키"
        value={height}
        onChange={e => setHeight(e.target.value)}
      />
      <Input
        className="block w-full border p-2 rounded"
        placeholder="몸무게"
        value={weight}
        onChange={e => setWeight(e.target.value)}
      />

      {/* 약관 동의 섹션 */}
      <div className="w-full border border-gray-300 rounded p-4 bg-gray-50 space-y-2">
        <label className="flex items-center font-semibold text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={allAgree}
            onChange={e => handleAllAgree(e.target.checked)}
          />
          모두 동의합니다
          <span className="ml-2 text-xs text-gray-500">(선택 동의 항목 포함)</span>
        </label>

        <div className="ml-6 space-y-1 mt-2 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={termsAgree.age14}
              onChange={e => handleTermChange('age14', e.target.checked)}
            />
            [필수] 만 14세 이상입니다
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={termsAgree.tos}
              onChange={e => handleTermChange('tos', e.target.checked)}
            />
            [필수] 이용약관 동의
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={termsAgree.privacy}
              onChange={e => handleTermChange('privacy', e.target.checked)}
            />
            [필수] 개인정보 수집 및 이용 동의
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={termsAgree.privacyOption}
              onChange={e => handleTermChange('privacyOption', e.target.checked)}
            />
            [선택] 개인정보 수집 및 이용 동의
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={termsAgree.adsOption}
              onChange={e => handleTermChange('adsOption', e.target.checked)}
            />
            [선택] 광고성 정보 수신 모두 동의
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white py-3 rounded text-lg font-bold tracking-wider"
      >
        회원가입
      </Button>
    </form>
  );
}
