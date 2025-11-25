"use client"
import React, { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import { normalAPI } from '@/lib/axios';
export default function SignupForm() {
  const [name, setName] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [isEmailCodeEnabled, setIsEmailCodeEnabled] = useState(false);
  const [isSendCodeDisabled, setIsSendCodeDisabled] = useState(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [allAgree, setAllAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState({
    age14: false,
    tos: false,
    privacy: false,
    privacyOption: false,
    adsOption: false,
  });

  const handleSendCode = async () => {
    if (!email) return;
    setIsSendCodeDisabled(true);
    try {
      await sendAuthCode(email);
      setIsEmailCodeEnabled(true);
    } catch (e) {
      setIsSendCodeDisabled(false);
    }
    // setIsEmailCodeEnabled(true);   // 주석처리해야함
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { alert('이름이 비어있습니다.'); return; }
    if (!userid) { alert('아이디가 비어있습니다.'); return; }
    if (!password) { alert('비밀번호가 비어있습니다.'); return; }
    if (!email) { alert('이메일이 비어있습니다.'); return; }
    if (!isEmailVerified) { alert('이메일 인증을 완료해 주세요.'); return; }
    if (!height) { alert('키가 비어있습니다.'); return; }
    if (!weight) { alert('몸무게가 비어있습니다.'); return; }

    const body = {
      nickname: name,
      customId: userid,
      password,
      email,
      height: parseInt(height, 10),
      weight: parseInt(weight, 10),
      mailcheck: isEmailVerified,
      // mailcheck: true, // 이게 true여도 서버측에서 기록하지않는한 회원가입 불가능함 이메일 인증되는게 우선!!!
    };

    try {
      const response = await normalAPI.post('/api/users/signup', body);
      if (response.status === 200) {
        alert(response.data.message || '회원가입이 완료되었습니다.');
        // 가입 후 로그인 페이지로 이동
        window.location.href = '/login';
      } else if (response.status === 400) {
        alert(response.data.message || Object.values(response.data)[0]);
      } else {
        alert('가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const sendAuthCode = async (email) => {
    try {
      const response = await normalAPI.post('/api/email', { email });
      alert(response.data.message || '인증번호 전송 완료');
    } catch (err) {
      alert('인증번호 전송 실패');
      throw err;
    }
  };

  const verifyAuthCode = async (code) => {
    if (!email) { alert('이메일을 입력해주세요.'); return; }
    if (!code) { alert('인증번호를 입력해주세요.'); return; }
    setIsVerifyDisabled(true);
    try {
      const response = await normalAPI.get('/api/email', {
        data: {
          email: email,
          code: code
        }
      });
      if (response.status === 200) {
        alert('이메일 인증이 완료되었습니다.');
        setIsEmailVerified(true);
      } else {
        alert('인증에 실패했습니다.');
      }
    } catch (err) {
      alert('인증 확인에 실패했습니다.');
      console.error(err);
    } finally {
      setIsVerifyDisabled(false);
    }
  };


  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4 relative"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold absolute left-6 top-6 mb-0">회원가입</h2>
      <div className="pt-14" />

      <Input
        className="block w-full border p-2 rounded"
        placeholder="이름"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Input
        className="block w-full border p-2 rounded"
        placeholder="아이디"
        value={userid}
        onChange={e => setUserid(e.target.value)}
      />

      <Input
        type="password"
        className="block w-full border p-2 rounded"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
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
          className={`${(!email || isSendCodeDisabled) ? 'bg-gray-400' : 'bg-black'} px-2 rounded text-sm text-white`}
          onClick={handleSendCode}
          disabled={!email || isSendCodeDisabled}
        >
          인증번호 전송
        </Button>
      </div>

      <div className="flex space-x-2">
        <Input
          className={`flex-1 border p-2 rounded ${isEmailCodeEnabled ? '' : 'bg-gray-100'}`}
          placeholder="인증번호"
          value={emailCode}
          onChange={e => setEmailCode(e.target.value)}
          disabled={!isEmailCodeEnabled}
        />
        <Button
          type="button"
          className={`${(!emailCode || isVerifyDisabled) ? 'bg-gray-400' : 'bg-black'} px-2 rounded text-sm text-white`}
          onClick={() => verifyAuthCode(emailCode)}
          disabled={!emailCode || isVerifyDisabled}
        >
          확인
        </Button>
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