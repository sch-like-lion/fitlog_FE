"use client";
import Link from "next/link";
import { useState } from "react";
import "./AppSetting.css";

export default function AppSetting() {
  // true=허용, false=미허용
  const [soundModeVibration, setSoundModeVibration] = useState(false); 
  const [alarmAllowed, setAlarmAllowed] = useState(true);              
  const [focusMode, setFocusMode] = useState(false);                   

  const [emailOn, setEmailOn] = useState(false);
  const [smsOn, setSmsOn] = useState(false);
  const [darkModeOn, setDarkModeOn] = useState(true);

  return (
    <main className="appSetting">
      <h2 className="sectionTitle">알림설정</h2>

      <div className="row">
       
        <p id="lbl-sound" className="rowLabel">알림 소리 모드</p>
        <div className="pillGroup" role="group" aria-labelledby="lbl-sound">
          <button
            type="button"
            className={`pill ${!soundModeVibration ? "onBlue" : "off"}`}
            onClick={() => setSoundModeVibration(false)} // 소리
          >
            소리
          </button>
          <button
            type="button"
            className={`pill ${soundModeVibration ? "onRed" : "off"}`}
            onClick={() => setSoundModeVibration(true)} // 진동
          >
            진동
          </button>
        </div>
      </div>

      <hr className="divider" />


      <div className="row">
        <p id="lbl-workout" className="rowLabel">운동 시작/종료 알림 받기</p>
        <div className="pillGroup" role="group" aria-labelledby="lbl-workout">
          <button
            type="button"
            className={`pill ${alarmAllowed ? "onBlue" : "off"}`}
            onClick={() => setAlarmAllowed(true)}
          >
            허용
          </button>
          <button
            type="button"
            className={`pill ${!alarmAllowed ? "onRed" : "off"}`}
            onClick={() => setAlarmAllowed(false)}
          >
            미허용
          </button>
        </div>
      </div>

      <hr className="divider" />

      
      <div className="row">
        <p id="lbl-focus" className="rowLabel">집중모드</p>
        <div className="pillGroup" role="group" aria-labelledby="lbl-focus">
          <button
            type="button"
            className={`pill ${focusMode ? "onBlue" : "off"}`}
            onClick={() => setFocusMode(true)}
          >
            켜기
          </button>
          <button
            type="button"
            className={`pill ${!focusMode ? "onRed" : "off"}`}
            onClick={() => setFocusMode(false)}
          >
            끄기
          </button>
        </div>
      </div>

      <hr className="bigDivider" />

      <h3 className="sectionTitle small">알림 수신 방법</h3>

    
      <div className="channelRow">
        <span className="channelLabel">이메일</span>
        <span className="channelPills" role="group" aria-label="이메일 수신">
          <button
            type="button"
            className={`miniPill ${emailOn ? "onBlue" : "off"}`}
            onClick={() => setEmailOn(true)}
          >
            허용
          </button>
          <button
            type="button"
            className={`miniPill ${!emailOn ? "onRed" : "off"}`}
            onClick={() => setEmailOn(false)}
          >
            미허용
          </button>
        </span>
      </div>

      <div className="channelRow">
        <span className="channelLabel">문자메시지</span>
        <span className="channelPills" role="group" aria-label="문자 수신">
          <button
            type="button"
            className={`miniPill ${smsOn ? "onBlue" : "off"}`}
            onClick={() => setSmsOn(true)}
          >
            허용
          </button>
          <button
            type="button"
            className={`miniPill ${!smsOn ? "onRed" : "off"}`}
            onClick={() => setSmsOn(false)}
          >
            미허용
          </button>
        </span>
      </div>

      <div className="channelRow">
        <span className="channelLabel">다크모드</span>
        <span className="channelPills" role="group" aria-label="다크모드 설정">
          <button
            type="button"
            className={`miniPill ${darkModeOn ? "onBlue" : "off"}`}
            onClick={() => setDarkModeOn(true)}
          >
            켜기
          </button>
          <button
            type="button"
            className={`miniPill ${!darkModeOn ? "onRed" : "off"}`}
            onClick={() => setDarkModeOn(false)}
          >
            끄기
          </button>
        </span>
      </div>
    </main>
  );
}
