"use client";
import React, { useState, useEffect } from 'react';
import { localStorageAPI } from '@/lib/axios';

// 운동 기록량에 따라 명도 계산 (0~1)
function getIntensity(records) {
  if (!records || records.length === 0) return 0;
  // 예시: 운동 세트 수 합산
  const total = records.reduce((sum, r) => sum + (r.set || 0), 0);
  return Math.min(total / 10, 1); // 최대 1
}

export default function CalendarPage() {
  // 현재 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0~11
  const today = new Date();

  // 선택된 날짜 상태 (YYYY-MM-DD)
  const [selected, setSelected] = useState(
    `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  // 운동 기록 상태 (날짜별로 저장)
  const [monthRecords, setMonthRecords] = useState({});
  const [selectedDayRecords, setSelectedDayRecords] = useState([]); // 선택한 날의 운동 기록
  const [loading, setLoading] = useState(false);
  const [monthLoading, setMonthLoading] = useState(false);

  // 로그인한 사용자 ID를 localStorage에서 읽어오도록 변경
  // (LoginForm에서 localStorage.setItem('userId', id)로 저장함)
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('userId') || localStorage.getItem('customId') || null;
      if (uid !== null) {
        // 숫자형 ID를 기대하면 Number(uid)로 변환, 문자열이면 그대로 사용
        const parsed = Number(uid);
        setUserId(!isNaN(parsed) ? parsed : uid);
      }
    }
  }, []);

  // 특정 날짜의 운동 기록 조회
  const fetchDayRecord = async (date) => {
    // userId가 문자열(예: customId)로 저장되어 있고
    // 서버가 내부 numeric id를 기대할 수 있으므로 토큰의 sub를 우선 사용하도록 시도
    let userIdParam = null;
    if (userId) {
      // 숫자형으로 사용 가능한 값이면 그대로 사용
      const n = Number(userId);
      if (!isNaN(n)) userIdParam = n;
    }

    if (!userIdParam) {
      // localStorage에 저장된 accessToken에서 sub(claim)를 파싱해서 사용해본다
      try {
        const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (t) {
          const payload = JSON.parse(atob(t.split('.')[1]));
          const sub = payload?.sub;
          const sn = Number(sub);
          if (sub && !isNaN(sn)) userIdParam = sn;
        }
      } catch (e) {
        // parsing 실패 시 무시하고 아래에서 빈 결과 반환
        console.warn('토큰에서 user id 파싱 실패', e);
      }
    }

    if (!userIdParam) return [];

    try {
      const response = await localStorageAPI.get('/api/calender', {
        params: {
          userId: userIdParam,
          date: date // YYYY-MM-DD 형식으로 get 요청을 보냄
        }
      });

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        // 응답이 단일 객체인 경우 배열로 변환
        const recordArray = Array.isArray(data) ? data : [data];
        return recordArray;
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // 해당 날짜에 기록이 없는 경우
        return [];
      } else {
        console.error('운동 기록 조회 실패:', err);
        return [];
      }
    }
  };

  const fetchMonthRecords = async (year, month) => {
    setMonthLoading(true);
    const newMonthRecords = {};

    if (!userId) {
      // 사용자 ID가 없으면 빈 데이터로 처리
      setMonthRecords({});
      setMonthLoading(false);
      return;
    }

    // 해당 월의 첫날과 마지막날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 모든 날짜에 대해 병렬로 API 요청
    const promises = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      promises.push(
        fetchDayRecord(dateStr).then(records => {
          if (records && records.length > 0) {
            newMonthRecords[dateStr] = records;
          }
        })
      );
    }

    // 모든 요청이 완료될 때까지 대기
    await Promise.all(promises);
    
    setMonthRecords(newMonthRecords);
    setMonthLoading(false);
  };

  // ✅ 월 또는 userId가 바뀔 때마다 해당 월의 전체 기록 로드
  useEffect(() => {
    fetchMonthRecords(year, month);
  }, [year, month, userId]);

  // 선택한 날짜가 바뀔 때마다 해당 날짜 기록 표시
  useEffect(() => {
    setLoading(true);
    // monthRecords에서 선택한 날짜의 기록 가져오기
    const records = monthRecords[selected] || [];
    setSelectedDayRecords(records);
    setLoading(false);
  }, [selected, monthRecords]);

  // 달력에 표시될 첫날(이전달 포함)과 마지막날(다음달 포함) 계산
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());
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

  return (
    <div style={{ background: '#f7f3ef', minHeight: '100vh', padding: 20 }}>
      {/* 중앙 헤더 + 구분선 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
        <button
          aria-label="이전 달"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', marginRight: 8 }}
          disabled={monthLoading}
        >◀</button>
        <span style={{ fontWeight: '700', fontSize: 20, minWidth: 120, textAlign: 'center' }}>
          {year}년 {month + 1}월
          {monthLoading && <span style={{ fontSize: 14, color: '#666', marginLeft: 8 }}>로딩중...</span>}
        </span>
        <button
          aria-label="다음 달"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', marginLeft: 8 }}
          disabled={monthLoading}
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
            const intensity = getIntensity(monthRecords[dateStr]);
            const isSelected = selected === dateStr;
            const isCurrentMonth = y === year && m === month + 1;
            return (
              <div
                key={dateStr}
                onClick={() => !monthLoading && setSelected(dateStr)}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  position: 'relative',
                  cursor: isCurrentMonth && !monthLoading ? 'pointer' : 'default',
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
          {loading || monthLoading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>로딩 중...</div>
          ) : selectedDayRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>운동 기록이 없습니다.</div>
          ) : (
            selectedDayRecords.map((r, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', background: '#fff',
                borderRadius: 12, marginBottom: 8, padding: 12, boxShadow: '0 1px 4px #eee'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: '#e88c2b', marginRight: 12
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{r.exercise}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>
                    {r.set}세트 · {r.weight}kg · {r.time}분
                  </div>
                  {r.strength && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      강도: {r.strength} · 피로도: {r.fatigue}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}