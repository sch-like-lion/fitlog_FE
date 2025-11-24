"use client";
import Link from "next/link";
import { useState } from "react";
import "./Settings.css";
export default function Settings() {
  return (
    <main className="settings">
      {/* 상단 프로필 영역 */}
      <section className="profile">
        <div className="avatar" aria-hidden="true"></div>
        <div className="meta">
          <p className="nickname">user-nickname</p>
          <a href="/settings/profile-setting" className="edit">프로필 편집</a>
        </div>
      </section>

      {/* 메뉴 리스트 */}
      <nav className="menu">
        <button type="button" className="menuItem">로그아웃</button>
        <button type="button" className="menuItem">회원탈퇴</button>
        <a href="/settings/app-setting" className="menuItem">앱 설정</a>
      </nav>
    </main>
  );
}
