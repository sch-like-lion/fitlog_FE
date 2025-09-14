"use client"
import React, { useState } from "react";
import styles from "./FindIdForm.module.css";
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";

function FindIdForm() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSendVerification1 = () => {
    setIsEmailVerified(true);
  };

  const handleSendVerification2 = () => {
    setIsCodeVerified(true);
  };

  const handleFindId = () => {
    setId("SchUniversity");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 🔒 모든 필드 + 인증 완료 조건
  const isFormValid =
    name.trim() &&
    email.trim() &&
    code.trim() &&
    isEmailVerified &&
    isCodeVerified;

  return (
    <>
      <div className = "">
        <div className="flex flex-col gap-5 mb-6">
          <Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm px-0 py-0 rounded-xl"
            >
              전송
            </Button>
          {isEmailVerified && (
            <div className="text-green-600 font-bold text-xs absolute mt-1/2">이메일 인증이 완료되었습니다</div>
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm px-1 py-1 rounded-xl"
            >
              확인
            </Button>
          {isCodeVerified && (
            <div className="text-green-600 font-bold text-xs absolute">인증번호 확인이 완료되었습니다</div>
          )}
          </div>
        </div>
        <Button
          onClick={handleFindId}
          disabled={!isFormValid}
          className={"w-full"}

        >
          아이디 찾기
        </Button>
      </div>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>회원님의 아이디는 "<strong>{id}</strong>"입니다</p>
              <Button 
                onClick={handleCloseModal} 
                className={styles.modalCloseButton}
              >
                닫기
              </Button>
            </div>
          </div>
        )}
    </>
  );
}

export default FindIdForm;
