"use client";

import { useEffect } from "react";

/** 서비스 워커 등록 (PWA 설치/오프라인) */
export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* 등록 실패 시 조용히 무시 */
      });
    }
  }, []);
  return null;
}
