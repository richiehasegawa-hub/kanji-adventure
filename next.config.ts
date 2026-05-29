import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN内デバイス（iPhone/iPad）からのアクセスを許可（開発環境のみ有効）
  allowedDevOrigins: ["192.168.0.11"],
};

export default nextConfig;
