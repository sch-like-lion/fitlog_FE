"use client"
import React, { useState } from "react";
import styles from "./FindPwForm.module.css"; //module.css 사용
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";

function FindPwForm() {
  const [name, setName] = useState(""); //이름
  const [id, setId] = useState(""); //아이디
  const [email, setEmail] = useState(""); //이메일
  const [code, setCode] = useState(""); //인증번호

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showPwReset, setShowPwReset] = useState(false); //입력하지 않았을 떄, 입력이 눌ㄹ리지 않음

  const [newPw, setNewPw] = useState(""); //새로운 비밀번호 입력창
  const [confirmPw, setConfirmPw] = useState(""); //비밀번호 확인 창

  const handleSendVerification1 = () => {
    setIsEmailVerified(true); //이메일을 쳐야 인증번호 전송 버튼 가능
  };

  const handleSendVerification2 = () => {
    setIsCodeVerified(true); //인증번호를 쳐야 확인 버튼 가능
  };

  const isFormValid =
    name.trim() && //trim: 공백 제거 &&: 참
    id.trim() &&
    email.trim() &&
    code.trim() &&
    isEmailVerified &&
    isCodeVerified;

  const handleFindPassword = () => {
    setShowPwReset(true); // 비밀번호 재설정 창 열기
  };

  const handlePasswordChange = () => {
    alert("비밀번호가 변경되었습니다.");
    window.location.reload(); // 창 닫기 = 새로고침
  };

  const isPwMismatch = newPw && confirmPw && newPw !== confirmPw; //둘 다 입력되었고, 서로 다르면 → true (비밀번호 불일치) 그렇지 않으면 → false (입력 전이거나, 같으면)

  return (
    // <div className={styles.container}>
    <div className="flex flex-col gap-5">
      {!showPwReset ? (
        <>
          <Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)} //치는 순간 쓰게 해주는 코드
            // className={styles.inputFull} //inputFull: css에서 칸 
          />

          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            // className={styles.inputFull}
          />

          {/* <div className={styles.inputGroup}> */}
          <div className="relative">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // className={styles.inputHalf}
              className="w-full pr-20"
            />
            <Button
              // className={styles.smallButton}
              onClick={handleSendVerification1}
              disabled={!email.trim()} //안치면 안나타남
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
            >
              전송
            </Button>
          {isEmailVerified && (
            <div className="text-green-600 font-bold text-xs absolute">이메일 인증 완료</div> //인증번호 전송 누를시 나오는 문구
          )} 
          </div>


          {/* <div className={styles.inputGroup}> */}
          <div className="relative">
            <Input
              type="text"
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              // className={styles.inputHalf}
              className="w-full pr-20"
            />
            <Button
              // className={styles.smallButton}
              onClick={handleSendVerification2}
              disabled={!code.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
            >
              확인
            </Button>
          {isCodeVerified && (
            <div className="text-green-600 font-bold text-xs absolute">인증번호 확인 완료</div>
          )}
          </div>


          <Button
            // className={styles.findButton}
            disabled={!isFormValid}
            onClick={handleFindPassword}
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
            <div className="text-red-600 font-bold text-xs absolute">비밀번호가 다릅니다.</div> //다르면 에러 메세지
          )}

          <button
            className={styles.findButton}
            onClick={handlePasswordChange}
            disabled={!newPw || !confirmPw || isPwMismatch} //같아야 버튼 누를수 있음
          >
            비밀번호 변경
          </button>
        </>
      )}
    </div>
  );
}

export default FindPwForm;
