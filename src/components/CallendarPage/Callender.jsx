"use client";
import React, { useState } from 'react';

// 운동 기록 예시 데이터
const records = {
  '2025-11-11': [
    { name: '스쿼트', set: 5, reps: 10 },
    { name: '데드리프트', set: 4, reps: 8 },
    { name: '푸쉬업', set: 6, reps: 15 }
  ],
  '2025-11-15': [{ name: '데드리프트', set: 3, reps: 10 }],
  '2025-11-26': [{ name: '스쿼트', set: 7, reps: 12 }],
 };

function getIntensity(date) {
  // 운동 기록량에 따라 명도 결정 (0~1)
  const rec = records[date];
  if (!rec) return 0;
  // 예시: 운동 세트 수 합산
  const total = rec.reduce((sum, r) => sum + r.set, 0);
  return Math.min(total / 10, 1); // 최대 1
}

export default function CalendarPage() {
  // 현재 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0~11
  const today = new Date();

  // 달력에 표시될 첫날(이전달 포함)과 마지막날(다음달 포함) 계산
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  // 달력 시작: 첫날이 속한 주의 일요일
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());
  // 달력 끝: 마지막날이 속한 주의 토요일
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  // 주 단위로 날짜 배열 생성
  function groupDatesByWeek(start, end) {
    const weeks = [];
    let currentWeek = [];
    let current = new Date(start);
    while (current <= end) {
      currentWeek.push(new Date(current));
      if (currentWeek.length === 7 || current.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      current.setDate(current.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }
  const weeks = groupDatesByWeek(startDay, endDay);

  // 선택된 날짜 상태 (YYYY-MM-DD)
  const [selected, setSelected] = useState(
    `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  return (
    <div style={{ background: '#f7f3ef', minHeight: '100vh', padding: 20 }}>
      {/* 중앙 헤더 + 구분선 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
        <button
          aria-label="이전 달"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', marginRight: 8 }}
        >◀</button>
        <span style={{ fontWeight: '700', fontSize: 20, minWidth: 120, textAlign: 'center' }}>{year}년 {month + 1}월</span>
        <button
          aria-label="다음 달"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', marginLeft: 8 }}
        >▶</button>
      </div>
      <hr style={{ margin: '12px 0 16px 0 ', border: 'none', borderTop: '1.5px solid #000000' }} />

      <div style={{ background: '#f7f3ef', borderRadius: 20, padding: 20, margin: '5px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {/* 요일 헤더 */}
          {['일','월','화','수','목','금','토'].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', color: i === 0 ? '#e88c2b' : i === 6 ? '#2c4a8f' : '#222', paddingBottom: 6 }}>{d}</div>
          ))}
          {/* 요일 아래 구분선 */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i + 'line'} style={{ gridColumn: i + 1, height: 0, borderBottom: '1.5px solid #d6d6d6', marginBottom: 8 }} />
          ))}
          {/* 날짜 그리드 */}
          {weeks.map((week, wi) => week.map((date, di) => {
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const day = date.getDate();
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const intensity = getIntensity(dateStr);
            const isSelected = selected === dateStr;
            const isCurrentMonth = y === year && m === month + 1;
            return (
              <div
                key={dateStr}
                onClick={() => setSelected(dateStr)}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  position: 'relative',
                  cursor: isCurrentMonth ? 'pointer' : 'default',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  opacity: isCurrentMonth ? 1 : 0.6,
                  background: 'none',
                }}
              >
                {/* 운동한 날: 푸른색 원, 운동량 많을수록 진하게 */}
                {intensity > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                    borderRadius: '50%',
                    background: `rgba(44, 74, 143, ${0.3 + intensity * 0.7})`,
                    zIndex: 1,
                  }} />
                )}
                {/* 선택한 날: 주황색 테두리 원 */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                    borderRadius: '50%',
                    border: '2px solid #e88c2b',
                    boxSizing: 'border-box',
                    zIndex: 2,
                  }} />
                )}
                <span style={{ position: 'relative', zIndex: 3, color: intensity > 0 ? '#fff' : isCurrentMonth ? '#222' : '#bbb' }}>{day}</span>
              </div>
            );
          }))}
        </div>
        <hr style={{ margin: '24px 0' }} />
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
            {parseInt(selected.split('-')[2], 10)}일 운동 기록
          </div>
          {(records[selected] || []).map((r, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', background: '#fff',
              borderRadius: 12, marginBottom: 8, padding: 12, boxShadow: '0 1px 4px #eee'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: '#e88c2b', marginRight: 12
              }} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{r.name}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{r.set}세트 {r.reps}회</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}