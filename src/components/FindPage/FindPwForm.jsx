"use client";
import React, { useState } from "react";
import styles from "./FindPwForm.module.css"; // 있어도 되고, 안 써도 됨 (아래에서 errorMessage 안 쓰면 삭제 가능)
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";
import { normalAPI } from "@/lib/axios";

function FindPwForm() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false); // "전송 성공" 플래그
  const [isCodeVerified, setIsCodeVerified] = useState(false);   // 인증번호 검증 성공
  const [showPwReset, setShowPwReset] = useState(false);         // 새 비번 입력 단계 진입 여부

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [resetToken, setResetToken] = useState("");              // verify-code 응답에서 받는 토큰

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  // 1) 이메일로 인증번호 전송: POST /api/email (ID 찾기와 동일하게 사용)
  const handleSendVerification1 = async () => {
    if (!email.trim()) return;
    try {
      setLoadingEmail(true);

      const res = await normalAPI.post("/api/email", {
        email: email.trim(),
      });
      console.log("비밀번호 찾기 인증메일 전송 성공:", res.data);

      setIsEmailVerified(true);
      setIsCodeVerified(false);
      setResetToken("");
      alert("인증번호를 이메일로 전송했습니다.");
    } catch (err) {
      console.error("인증메일 전송 실패:", err);
      setIsEmailVerified(false);
      alert("이메일 전송에 실패했습니다. 이메일을 다시 확인해주세요.");
    } finally {
      setLoadingEmail(false);
    }
  };

  // 2) 인증번호 확인 및 resetToken 발급: POST /api/users/password/verify-code
  // body: { email, verificationCode }
  const handleSendVerification2 = async () => {
    if (!email.trim() || !code.trim()) return;
    try {
      setLoadingCode(true);

      const res = await normalAPI.post("/api/users/password/verify-code", {
        email: email.trim(),
        verificationCode: code.trim(),
      });

      const token = res.data?.resetToken;
      console.log("인증번호 검증 성공:", res.data);

      if (!token) {
        setIsCodeVerified(false);
        alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setResetToken(token);
      setIsCodeVerified(true);
      alert("인증번호 확인이 완료되었습니다. 비밀번호를 재설정할 수 있습니다.");
    } catch (err) {
      console.error("인증번호 검증 실패:", err);
      setIsCodeVerified(false);

      const status = err?.response?.status;
      if (status === 404) {
        alert("인증번호가 일치하지 않거나 만료되었습니다.");
      } else if (status === 400) {
        alert("입력하신 정보가 올바르지 않습니다.");
      } else {
        alert("인증번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoadingCode(false);
    }
  };

  // "비밀번호 찾기" 버튼 클릭 → 새 비밀번호 입력 섹션 열기
  const handleFindPassword = () => {
    if (!isFormValid) return;

    if (!resetToken) {
      alert("인증번호 확인을 먼저 완료해주세요.");
      return;
    }

    setShowPwReset(true);
  };

  // 3) 비밀번호 변경: PATCH /api/users/password/reset
  // header: Authorization: Bearer {resetToken}
  // body: { newPassword }
  const handlePasswordChange = async () => {
    if (!newPw || !confirmPw || isPwMismatch) return;

    try {
      setLoadingReset(true);

      const res = await normalAPI.patch(
        "/api/users/password/reset",
        { newPassword: newPw },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      console.log("비밀번호 재설정 성공:", res.data);
      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");

      window.location.reload();
    } catch (err) {
      console.error("비밀번호 재설정 실패:", err);

      const status = err?.response?.status;
      if (status === 400) {
        alert("요청이 올바르지 않습니다. 다시 시도해주세요.");
      } else if (status === 401) {
        alert("재설정 토큰이 유효하지 않거나 만료되었습니다. 처음부터 다시 진행해주세요.");
      } else {
        alert("비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoadingReset(false);
    }
  };

  const isFormValid =
    name.trim() && // 현재 명세에는 name/id 안 쓰지만, 화면 요구사항에 맞춰 유지
    id.trim() &&
    email.trim() &&
    code.trim() &&
    isEmailVerified &&
    isCodeVerified;

  const isPwMismatch = newPw && confirmPw && newPw !== confirmPw;

  // ====== 여기부터 UI (디자인) 부분 ======
  // 아이디 찾기 JSX의 클래스들을 그대로 가져와서 사용

  if (!showPwReset) {
    // 1단계: 비밀번호 찾기(이름/아이디/이메일/인증번호)
    return (
      <>
        <div>
          <div className="flex flex-col gap-5 mb-6">
            {/* 이름 */}
            <Input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
            />

            {/* 아이디 */}
            <Input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
            />

            {/* 이메일 + 전송 */}
            <div className="relative">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailVerified(false);
                  setIsCodeVerified(false);
                  setResetToken("");
                }}
                className="w-full pr-20 bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
              />
              <Button
                onClick={handleSendVerification1}
                disabled={!email.trim() || loadingEmail}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-xl
                           bg-[#2F4A67] text-white disabled:bg-[#D2C9C1]"
              >
                {loadingEmail ? "전송중..." : "전송"}
              </Button>
              {isEmailVerified && (
                <div className="text-green-600 font-bold text-xs mt-1">
                  이메일 인증번호가 전송되었습니다
                </div>
              )}
            </div>

            {/* 인증번호 + 확인 */}
            <div className="relative">
              <Input
                type="text"
                placeholder="인증번호"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setIsCodeVerified(false);
                  setResetToken("");
                }}
                className="w-full pr-20 bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
              />
              <Button
                onClick={handleSendVerification2}
                disabled={!code.trim() || !email.trim() || loadingCode}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-xl
                           bg-[#2F4A67] text-white disabled:bg-[#D2C9C1]"
              >
                {loadingCode ? "확인중..." : "확인"}
              </Button>
              {isCodeVerified && (
                <div className="text-green-600 font-bold text-xs mt-1">
                  인증번호 확인이 완료되었습니다
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 찾기 버튼 → 아이디 찾기 버튼과 동일 스타일 */}
          <Button
            disabled={!isFormValid}
            onClick={handleFindPassword}
            className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
          >
            비밀번호 찾기
          </Button>
        </div>
      </>
    );
  }

  // 2단계: 새 비밀번호 입력 단계
  return (
    <>
      <div>
        <div className="flex flex-col gap-5 mb-6">
          <Input
            type="password"
            placeholder="새로운 비밀번호 입력"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
          />

          <Input
            type="password"
            placeholder="새로운 비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
          />

          {isPwMismatch && (
            <div className="text-red-600 font-bold text-xs mt-1">
              비밀번호가 서로 일치하지 않습니다.
            </div>
          )}
        </div>

        {/* 비밀번호 변경 버튼도 동일 스타일 */}
        <Button
          onClick={handlePasswordChange}
          disabled={!newPw || !confirmPw || isPwMismatch || loadingReset}
          className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
        >
          {loadingReset ? "변경중..." : "비밀번호 변경"}
        </Button>
      </div>
    </>
  );
}

export default FindPwForm;


// "use client"
// import React, { useState } from "react";
// import styles from "./FindPwForm.module.css"; // module.css 사용
// import Input from "../common/Input/Input";
// import Button from "../common/Button/Button";

// function FindPwForm() {
//   const [name, setName] = useState("");
//   const [id, setId] = useState("");
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");

//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isCodeVerified, setIsCodeVerified] = useState(false);
//   const [showPwReset, setShowPwReset] = useState(false);

//   const [newPw, setNewPw] = useState("");
//   const [confirmPw, setConfirmPw] = useState("");

//   const handleSendVerification1 = () => setIsEmailVerified(true);
//   const handleSendVerification2 = () => setIsCodeVerified(true);

//   const isFormValid =
//     name.trim() &&
//     id.trim() &&
//     email.trim() &&
//     code.trim() &&
//     isEmailVerified &&
//     isCodeVerified;

//   const handleFindPassword = () => setShowPwReset(true);

//   const handlePasswordChange = () => {
//     alert("비밀번호가 변경되었습니다.");
//     window.location.reload();
//   };

//   const isPwMismatch = newPw && confirmPw && newPw !== confirmPw;

//   return (
//     <div className="flex flex-col gap-5">
//       {!showPwReset ? (
//         <>
//           <Input
//             type="text"
//             placeholder="이름"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           <Input
//             type="text"
//             placeholder="아이디"
//             value={id}
//             onChange={(e) => setId(e.target.value)}
//           />

//           <div className="relative">
//             <Input
//               type="email"
//               placeholder="이메일"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pr-20"
//             />
//             <Button
//               onClick={handleSendVerification1}
//               disabled={!email.trim()}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
//             >
//               전송
//             </Button>
//             {isEmailVerified && (
//               <div className="text-green-600 font-bold text-xs absolute">
//                 이메일 인증 완료
//               </div>
//             )}
//           </div>

//           <div className="relative">
//             <Input
//               type="text"
//               placeholder="인증번호"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               className="w-full pr-20"
//             />
//             <Button
//               onClick={handleSendVerification2}
//               disabled={!code.trim()}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-xl"
//             >
//               확인
//             </Button>
//             {isCodeVerified && (
//               <div className="text-green-600 font-bold text-xs absolute">
//                 인증번호 확인 완료
//               </div>
//             )}
//           </div>

//           {/* 비밀번호 찾기 버튼 */}
//           <Button
//             disabled={!isFormValid}
//             onClick={handleFindPassword}
//             className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
//           >
//             비밀번호 찾기
//           </Button>
//         </>
//       ) : (
//         <>
//           <Input
//             type="password"
//             placeholder="새로운 비밀번호 입력"
//             value={newPw}
//             onChange={(e) => setNewPw(e.target.value)}
//             className={styles.inputFull}
//           />

//           <Input
//             type="password"
//             placeholder="새로운 비밀번호 확인"
//             value={confirmPw}
//             onChange={(e) => setConfirmPw(e.target.value)}
//             className={styles.inputFull}
//           />

//           {isPwMismatch && (
//             <div className="text-red-600 font-bold text-xs absolute">
//               비밀번호가 다릅니다.
//             </div>
//           )}

//           {/* 비밀번호 변경 버튼도 동일 스타일 적용 */}
//           <Button
//             onClick={handlePasswordChange}
//             disabled={!newPw || !confirmPw || isPwMismatch}
//             className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
//           >
//             비밀번호 변경
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

// export default FindPwForm;
