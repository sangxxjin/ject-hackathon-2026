import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 없는 주소(예: /asdfj, /a/b)는 서버에서 바로 메인으로 보낸다 (307).
   * 제외: /intro, /api/*, /_next/*, 점이 들어간 파일 경로(/logo.svg 등).
   * 페이지를 추가하면 여기 제외 목록에 넣는다.
   * 파일처럼 생긴 없는 주소는 app/not-found.tsx가 브라우저에서 메인으로 보낸다.
   */
  async redirects() {
    return [
      {
        source: "/:path((?!intro(?:/|$)|api/|_next/)[^.]+)",
        destination: "/",
        permanent: false,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
