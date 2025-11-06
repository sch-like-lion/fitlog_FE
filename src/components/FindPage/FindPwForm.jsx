"use client"
import React, { useState } from "react";
import styles from "./FindPwForm.module.css"; // module.css 사용
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";

function FindPwForm() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showPwReset, setShowPwReset] = useState(false);

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSendVerification1 = () => setIsEmailVerified(true);
  const handleSendVerification2 = () => setIsCodeVerified(true);

  const isFormValid =
    name.trim() &&
    id.trim() &&
    email.trim() &&
    code.trim() &&
    isEmailVerified &&
    isCodeVerified;

  const handleFindPassword = () => setShowPwReset(true);

  const handlePasswordChange = () => {
    alert("비밀번호가 변경되었습니다.");
    window.location.reload();
  };

  const isPwMismatch = newPw && confirmPw && newPw !== confirmPw;

  return (
    <div className="flex flex-col gap-5">
      {!showPwReset ? (
        <>
          <Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <div className="relative">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-20"
            />
            <Button
              onClick={handleSendVerification1}
              disabled={!email.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
            >
              전송
            </Button>
            {isEmailVerified && (
              <div className="text-green-600 font-bold text-xs absolute">
                이메일 인증 완료
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pr-20"
            />
            <Button
              onClick={handleSendVerification2}
              disabled={!code.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
            >
              확인
            </Button>
            {isCodeVerified && (
              <div className="text-green-600 font-bold text-xs absolute">
                인증번호 확인 완료
              </div>
            )}
          </div>

          {/* 비밀번호 찾기 버튼 */}
          <Button
            disabled={!isFormValid}
            onClick={handleFindPassword}
            className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
          >
            비밀번호 찾기
          </Button>
        </>
      ) : (
        <>
          <Input
            type="password"
            placeholder="새로운 비밀번호 입력"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className={styles.inputFull}
          />

          <Input
            type="password"
            placeholder="새로운 비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className={styles.inputFull}
          />

          {isPwMismatch && (
            <div className="text-red-600 font-bold text-xs absolute">
              비밀번호가 다릅니다.
            </div>
          )}

          {/* 비밀번호 변경 버튼도 동일 스타일 적용 */}
          <Button
            onClick={handlePasswordChange}
            disabled={!newPw || !confirmPw || isPwMismatch}
            className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
          >
            비밀번호 변경
          </Button>
        </>
      )}
    </div>
  );
}

export default FindPwForm;
