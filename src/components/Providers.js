'use client';

import { Provider } from 'jotai';
import { useEffect } from 'react';

function DevAuthInjector() {
  useEffect(() => {
    try {
      // 자동 임시 토큰 주입: 개발 편의 목적
      // - NEXT_PUBLIC_AUTO_SET_DEV_TOKEN=true 로 활성화하거나
      // - localhost/127.0.0.1 접속 시 토큰이 없으면 자동으로 삽입합니다.
      const autoSet = process.env.NEXT_PUBLIC_AUTO_SET_DEV_TOKEN === 'true';
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

      if (!hasToken && (autoSet || isLocal)) {
        // 실제 토큰 형식을 모르면 단순 플래그 문자열을 넣습니다.
        localStorage.setItem('accessToken', 'dev-auto-token');
        console.log('[DevAuthInjector] injected dev accessToken');
      }
    } catch (e) {
      // 무시 - 개발용 안전장치
      console.warn('DevAuthInjector error', e);
    }
  }, []);

  return null;
}

export default function Providers({ children }) {
  return (
    <Provider>
      <DevAuthInjector />
      {children}
    </Provider>
  );
}