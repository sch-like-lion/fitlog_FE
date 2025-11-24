"use client";
import React, { useState } from "react";
import styles from "./FindIdForm.module.css";
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";
import { normalAPI } from "@/lib/axios"; // 경로: src/lib/axios.js 기준

export default function FindIdForm() {
  const [name, setName] = useState("");          // = nickname
  const [id, setId] = useState("");              // 서버에서 받는 customid
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingFindId, setLoadingFindId] = useState(false);

  // 1) 이메일로 인증번호 전송: POST /api/email
  const handleSendVerification1 = async () => {
    if (!email.trim()) return;
    try {
      setLoadingEmail(true);

      const res = await normalAPI.post("/api/email", {
        email: email.trim(),
      });

      // 성공 응답 형식: { message: "전송완료" + email }
      console.log("email send success:", res.data);
      setIsEmailVerified(true);
      alert("인증번호를 전송했습니다.");
    } catch (err) {
      console.error(err);
      setIsEmailVerified(false);
      alert("이메일 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoadingEmail(false);
    }
  };

  // 2) 인증번호 확인: GET /api/email
  // 명세상 body 로 되어있지만 GET이라 추정상 query param 사용
  const handleSendVerification2 = async () => {
    if (!code.trim()) return;
    try {
      setLoadingCode(true);

      const res = await normalAPI.get("/api/email", {
        params: {
          code: code.trim(),
        },
      });

      // 응답 예시: { email, mailcheck: boolean, verificationCode: "code" }
      const { mailcheck } = res.data || {};
      if (mailcheck) {
        setIsCodeVerified(true);
        alert("인증번호 확인이 완료되었습니다.");
      } else {
        setIsCodeVerified(false);
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      setIsCodeVerified(false);
      alert("인증번호 확인 중 오류가 발생했습니다.");
    } finally {
      setLoadingCode(false);
    }
  };

  // 3) 아이디 찾기: POST /api/users/find-id
  // body: { nickname, email }
  const handleFindId = async () => {
    if (!isFormValid) return;

    try {
      setLoadingFindId(true);

      const res = await normalAPI.post("/api/users/find-id", {
        nickname: name.trim(),
        email: email.trim(),
      });

      // 성공: { message: "ID찾기 성공", customid: "String" }
      const foundId = res.data?.customid;
      if (!foundId) {
        alert("아이디 정보를 찾지 못했습니다.");
        return;
      }

      setId(foundId);
      setShowModal(true);
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;
      if (status === 404) {
        alert("해당 정보로 가입된 사용자를 찾을 수 없습니다.");
      } else if (status === 400) {
        alert("입력값을 다시 확인해주세요.");
      } else {
        alert("아이디 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoadingFindId(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const isFormValid =
    name.trim() &&
    email.trim() &&
    code.trim() &&
    isEmailVerified &&
    isCodeVerified;

  return (
    <>
      <div>
        <div className="flex flex-col gap-5 mb-6">
          {/* 이름(닉네임) */}
          <Input
            type="text"
            placeholder="이름(닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              <div className="text-green-600 font-bold text-xs absolute mt-1">
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
              }}
              className="w-full pr-20 bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
            />
            <Button
              onClick={handleSendVerification2}
              disabled={!code.trim() || loadingCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-xl
                         bg-[#2F4A67] text-white disabled:bg-[#D2C9C1]"
            >
              {loadingCode ? "확인중..." : "확인"}
            </Button>
            {isCodeVerified && (
              <div className="text-green-600 font-bold text-xs absolute mt-1">
                인증번호 확인이 완료되었습니다
              </div>
            )}
          </div>
        </div>

        {/* 메인 버튼 */}
        <Button
          onClick={handleFindId}
          disabled={!isFormValid || loadingFindId}
          className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
        >
          {loadingFindId ? "조회중..." : "아이디 찾기"}
        </Button>
      </div>

      {/* 결과 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>
              회원님의 아이디는 "<strong>{id}</strong>" 입니다
            </p>
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




// "use client";
// import React, { useState } from "react";
// import styles from "./FindIdForm.module.css";
// import Input from "../common/Input/Input";
// import Button from "../common/Button/Button";

// export default function FindIdForm() {
//   const [name, setName] = useState("");
//   const [id, setId] = useState("");
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");

//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isCodeVerified, setIsCodeVerified] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const handleSendVerification1 = () => setIsEmailVerified(true);
//   const handleSendVerification2 = () => setIsCodeVerified(true);
//   const handleFindId = () => { setId("SchUniversity"); setShowModal(true); };
//   const handleCloseModal = () => setShowModal(false);

//   const isFormValid =
//     name.trim() && email.trim() && code.trim() && isEmailVerified && isCodeVerified;

//   return (
//     <>
//       <div className="">
//         <div className="flex flex-col gap-5 mb-6">
//           {/* 이름 */}
//           <Input
//             type="text"
//             placeholder="이름"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
//           />

//           {/* 이메일 + 전송 */}
//           <div className="relative">
//             <Input
//               type="email"
//               placeholder="이메일"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pr-20 bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
//             />
//             <Button
//               onClick={handleSendVerification1}
//               disabled={!email.trim()}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-xl
//                          bg-[#2F4A67] text-white disabled:bg-[#D2C9C1]"
//             >
//               전송
//             </Button>
//             {isEmailVerified && (
//             <div className="text-green-600 font-bold text-xs absolute">
//             이메일 인증이 완료되었습니다
//             </div>
//               )}
//           </div>

//           {/* 인증번호 + 확인 */}
//           <div className="relative">
//             <Input
//               type="text"
//               placeholder="인증번호"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               className="w-full pr-20 bg-white border border-[#E6E0DB] text-[#222] placeholder:text-[#A9A39E]"
//             />
//             <Button
//               onClick={handleSendVerification2}
//               disabled={!code.trim()}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded-xl
//                          bg-[#2F4A67] text-white disabled:bg-[#D2C9C1]"
//             >
//               확인
//             </Button>
//             {isCodeVerified && (
//               <div className="text-green-600 font-bold text-xs absolute">
//                 인증번호 확인이 완료되었습니다
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 메인 버튼 */}
//         <Button
//           onClick={handleFindId}
//           disabled={!isFormValid}
//           className="w-full bg-[#E08B3E] text-white disabled:bg-[#D6CCC3]"
//         >
//           아이디 찾기
//         </Button>
//       </div>

//       {showModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <p>
//               회원님의 아이디는 "<strong>{id}</strong>"입니다
//             </p>
//             <Button onClick={handleCloseModal} className={styles.modalCloseButton}>
//               닫기
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
