import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 폴더의 다른 package.json을 루트로 오인하지 않도록 이 폴더를 루트로 고정
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
